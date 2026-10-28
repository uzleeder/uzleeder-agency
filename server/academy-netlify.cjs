const fs=require('fs'),path=require('path'),os=require('os');
const cfg=JSON.parse(fs.readFileSync(path.join(os.homedir(),'AppData/Roaming/netlify/Config/config.json'),'utf8'));
const token=cfg.users[cfg.userId]?.auth?.token;
async function api(route,method='GET',data){const r=await fetch('https://api.netlify.com/api/v1'+route,{method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(data?{body:JSON.stringify(data)}:{})});const j=await r.json();if(!r.ok)throw Error(r.status+': '+(j.message||j.error));return j;}
(async()=>{
 const main=await api('/sites/5ae19c6e-3f91-4336-be2c-354b3e5f0cc5');
 const sites=await api('/'+main.account_slug+'/sites');
 let s=sites.find(x=>x.custom_domain==='academy.uzleeder.uz'||x.name==='uzleeder-academy');
 if(!s)s=await api('/'+main.account_slug+'/sites','POST',{name:'uzleeder-academy'});
 s=await api('/sites/'+s.id,'PATCH',{custom_domain:'academy.uzleeder.uz'});
 const dir=path.join(__dirname,'academy-deploy','.netlify');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'state.json'),JSON.stringify({siteId:s.id}));
 const env=require('util').parseEnv(fs.readFileSync('C:/Users/Max Miller.DESKTOP-LF582V9/Documents/Claude/uzleeder-academy/.env.leejon.local','utf8'));
 const allowed=['AUTH_USER','AUTH_PASSWORD_HASH','SESSION_SECRET','CTRL_USER','CTRL_PASSWORD_HASH','TEACHER_USER','TEACHER_PASSWORD_HASH','ENG_USER','ENG_PASSWORD_HASH','DATABASE_URL','STORAGE_URL','POSTGRES_URL','KV_REST_API_URL','KV_REST_API_TOKEN','BLOB_READ_WRITE_TOKEN'];
 const vars=allowed.filter(k=>env[k]).map(key=>({key,scopes:['builds','functions','post_processing','runtime'],values:[{context:'all',value:env[key]}]}));
 const base='/accounts/'+s.account_id+'/env'; const existing=await api(base+'?site_id='+s.id); for(const v of vars){ if(existing.some(x=>x.key===v.key)) await api(base+'/'+encodeURIComponent(v.key)+'?site_id='+s.id,'PUT',v); else await api(base+'?site_id='+s.id,'POST',[v]); }
 console.log(JSON.stringify({siteId:s.id,url:s.ssl_url,domain:s.custom_domain,configuredKeys:vars.map(x=>x.key)}));
})().catch(e=>{console.error(e.message);process.exitCode=1});

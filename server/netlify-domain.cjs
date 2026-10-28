// Uses the existing Netlify CLI login; never prints credentials.
const fs=require('fs'),path=require('path'),os=require('os');
const cfg=JSON.parse(fs.readFileSync(path.join(os.homedir(),'AppData/Roaming/netlify/Config/config.json'),'utf8'));
const token=cfg.users[cfg.userId]?.auth?.token;
if(!token)throw Error('Netlify login required');
const site=JSON.parse(fs.readFileSync(path.join(__dirname,'../.netlify/state.json'),'utf8')).siteId;
async function api(route,method='GET',data){const r=await fetch('https://api.netlify.com/api/v1'+route,{method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(data?{body:JSON.stringify(data)}:{})});const j=await r.json().catch(()=>({}));if(!r.ok)throw Error(r.status+': '+(j.message||j.error||'Netlify request failed'));return j;}
(async()=>{
 let s=await api('/sites/'+site);
 if(process.argv[2]==='verify-auth') {
  const env=require('node:util').parseEnv(fs.readFileSync(path.join(__dirname,'../.env'),'utf8'));
  const base=s.published_deploy.deploy_ssl_url;
  const r=await fetch(base+'/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:env.ADMIN_PASSWORD})});
  const j=await r.json(); console.log('Login HTTP',r.status,'session issued:',!!j.token);
  if(j.token){const w=await fetch(base+'/api/workspace',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+j.token},body:JSON.stringify({action:'overview'})});console.log('Authenticated Workspace HTTP',w.status);if(!w.ok){const e=await w.json();console.log('Workspace error:',e.error);}}
 }
 if(process.argv[2]==='sync-auth') {
  const env=require('node:util').parseEnv(fs.readFileSync(path.join(__dirname,'../.env'),'utf8'));
  if(!env.ADMIN_PASSWORD||env.ADMIN_SECRET?.length<32)throw Error('Valid existing local auth configuration required');
  for(const key of ['ADMIN_PASSWORD','ADMIN_SECRET']) {
   await api('/accounts/'+s.account_id+'/env/'+key+'?site_id='+site,'PUT',{key,scopes:['builds','functions','post_processing','runtime'],values:[{context:'all',value:env[key]}]});
   console.log(key+': existing local value configured for server functions');
  }
 }
 if(process.argv[2]==='env-check') {
  const vars=await api('/accounts/'+s.account_id+'/env?site_id='+site);
  console.log(JSON.stringify(vars.map(v=>({key:v.key,is_secret:v.is_secret,scopes:v.scopes,values:v.values.map(x=>({context:x.context,context_parameter:x.context_parameter,present:!!x.value,length:x.value?.length,placeholder:/redacted|masked|^\*+$/i.test(x.value||'')}))})),null,2));
 }
 if(process.argv[2]==='local-env-check') {
  for(const file of ['.env','.env.local']) {
   const p=path.join(__dirname,'..',file); if(!fs.existsSync(p))continue;
   const env=require('node:util').parseEnv(fs.readFileSync(p,'utf8'));
   console.log(file,Object.fromEntries(['ADMIN_SECRET','ADMIN_PASSWORD','TELEGRAM_BOT_TOKEN','TELEGRAM_CHAT_ID'].map(k=>[k,{present:!!env[k],length:env[k]?.length}])));
  }
 }
 if(process.argv[2]==='dns') {
  const zones=await api('/dns_zones?account_slug='+encodeURIComponent(s.account_slug));
  const zone=zones.find(z=>z.name==='uzleeder.uz')||await api('/dns_zones','POST',{account_slug:s.account_slug,site_id:site,name:'uzleeder.uz'});
  console.log(JSON.stringify({zone:zone.id,name:zone.name,dns_servers:zone.dns_servers,records:zone.records},null,2));
 }
 if(process.argv[2]==='connect')s=await api('/sites/'+site,'PATCH',{custom_domain:'uzleeder.uz',domain_aliases:[...new Set([...(s.domain_aliases||[]),'www.uzleeder.uz'])]});
 if(process.argv[2]==='tls') {const t=await api('/sites/'+site+'/ssl','POST');console.log(JSON.stringify({state:t.state,domains:t.domains,expires_at:t.expires_at}));}
 console.log(JSON.stringify({id:s.id,name:s.name,url:s.url,ssl_url:s.ssl_url,custom_domain:s.custom_domain,domain_aliases:s.domain_aliases,account_slug:s.account_slug,published_deploy:s.published_deploy&&{id:s.published_deploy.id,state:s.published_deploy.state,url:s.published_deploy.deploy_ssl_url,at:s.published_deploy.published_at}},null,2));
})().catch(e=>{console.error(e.message);process.exitCode=1;});

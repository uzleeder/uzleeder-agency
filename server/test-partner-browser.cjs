// Isolated browser QA: actual API handlers, in-memory storage, no production credentials.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root=path.resolve(__dirname,'..'),mem=new Map();
const mock={async put(k,v,o){if(mem.has(k)&&!o.allowOverwrite)throw Error('already exists');mem.set(k,{buf:Buffer.from(v),uploadedAt:new Date()});return {pathname:k};},async get(k){const v=mem.get(k);return v?{statusCode:200,stream:new Response(v.buf).body,blob:{size:v.buf.length}}:null;},async list({prefix=''}){return {blobs:[...mem].filter(([k])=>k.startsWith(prefix)).map(([pathname,v])=>({pathname,uploadedAt:v.uploadedAt})),hasMore:false};},async del(keys){for(const k of Array.isArray(keys)?keys:[keys])mem.delete(k);},async head(){return {};}};
require.cache[require.resolve('@vercel/blob')]={exports:mock};
Object.assign(process.env,{ADMIN_PASSWORD:'isolated-browser-test',ADMIN_SECRET:'isolated-browser-test-secret-32chars',BLOB_READ_WRITE_TOKEN:'test',BLOB_ACCESS:'private'});
for(const k of ['TELEGRAM_BOT_TOKEN','TELEGRAM_CHAT_ID','TELEGRAM_PUBLISH_BOT_TOKEN','TELEGRAM_SERVICES_BOT_TOKEN','YOUTUBE_REFRESH_TOKEN','GITHUB_TOKEN','VERCEL_TOKEN'])delete process.env[k];
const routes={'/partners':'partners.html','/workspace/partners':'partner-workspace.html','/admin':'admin.html','/workspace':'workspace.html','/':'index.html'};
const server=http.createServer(async(req,res)=>{try{
 const u=new URL(req.url,'http://localhost');req.query=Object.fromEntries(u.searchParams);
 if(u.pathname.startsWith('/api/')){const chunks=[];for await(const c of req)chunks.push(c);req.body=JSON.parse(Buffer.concat(chunks).toString()||'{}');const name=u.pathname.slice(5);if(!/^[a-z-]+$/.test(name))throw Error('bad route');return await require(path.join(root,'api',name+'.js'))(req,res);}
 const file=path.resolve(root,routes[u.pathname]||u.pathname.slice(1));if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
 }catch(e){res.statusCode=500;res.end(JSON.stringify({ok:false,error:e.message}));}});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const auth=require('../api/_lib/auth'),partners=require('../api/_lib/partners');const token=await auth.issue(Date.now()+3600000);
 await partners.dispatch({action:'configure',organization:'Isolated QA fixture',contact:'privacy@example.invalid',enabled:true,reviewed:true,retentionDays:30},{headers:{authorization:'Bearer '+token}});
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
 const context=await browser.newContext();await context.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/partners');await page.getByRole('button',{name:'Review application',exact:true}).waitFor();
 for(const width of [360,390,768,1024,1280,1440]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'public overflow '+width);}
 for(const [k,v] of Object.entries({name:'Browser Test Applicant',email:'browser@example.invalid',role:'Developer',skills:'Frontend and backend engineering',motivation:'Build useful tested products',previousWork:'A small sample project',collaboration:'Project-based collaboration'}))await page.locator('[name='+k+']').fill(v);
 await page.getByLabel('Software Development',{exact:true}).check();await page.getByRole('button',{name:'Review application',exact:true}).click();
 for(const k of ['truth','conditions','privacy'])await page.locator('[name='+k+']').check();
 await page.getByRole('button',{name:'Submit application',exact:true}).click();await page.getByRole('heading',{name:'Application received'}).waitFor();
 await page.getByRole('link',{name:'Open my application'}).click();await page.getByRole('button',{name:'Add response / correction'}).waitFor();
 assert.equal(await page.getByRole('heading',{name:'Private review'}).count(),0);
 await page.getByRole('button',{name:'Add response / correction'}).click();await page.getByLabel('Message / corrections').fill('Browser evidence response.');await page.getByRole('button',{name:'Save',exact:true}).click();await page.getByText(/Browser evidence response\./).waitFor();
 for(const width of [360,390,768,1024,1280,1440]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'applicant overflow '+width);}
 await page.addInitScript(t=>{sessionStorage.setItem('uz_admin_token',t);sessionStorage.setItem('uz_admin_exp',String(Date.now()+3600000));sessionStorage.setItem('uz_ws_token',t);},token);
 await page.goto(base+'/admin#/partners');await page.getByRole('heading',{name:'Partners',exact:true}).waitFor();
 await page.locator('[data-open]').first().click();await page.getByRole('heading',{name:'Private review',exact:true}).waitFor();
 await page.getByRole('button',{name:'Review / private notes'}).click();await page.getByLabel('Private note',{exact:true}).fill('Private browser review');await page.getByRole('button',{name:'Save',exact:true}).click();await page.getByText(/Private browser review/).waitFor();
 for(const width of [360,1440]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'admin overflow '+width);}
 await page.goto(base+'/workspace#partners');await page.getByRole('heading',{name:'Partners',exact:true}).waitFor();
 for(const width of [360,390,768,1024,1280,1440]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'workspace overflow '+width);}
 await page.goto(base+'/partners');await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>document.documentElement.setAttribute('data-theme','light'));await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.activeElement!==document.body));
 const output=path.join(__dirname,'.localdata','partner-qa');fs.mkdirSync(output,{recursive:true});await page.screenshot({path:path.join(output,'partners-light.png'),fullPage:true});
 assert.deepEqual(errors,[]);console.log('PASS browser application submission, applicant response, internal-note isolation, Admin review, Workspace integration, six widths, light theme, reduced motion, keyboard focus; no page errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>server.close());

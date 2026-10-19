// Real endpoint lifecycle against an isolated in-memory private Blob adapter. No external sends.
const assert=require('node:assert/strict');
const path=require('path');const root=path.join(__dirname,'..');const mem=new Map();
let failWrites=false;
const mock={
  async put(k,v,o){if(failWrites)throw new Error('storage offline');if(mem.has(k)&&!o.allowOverwrite)throw new Error('This blob already exists');mem.set(k,{buf:Buffer.from(v),uploadedAt:new Date()});return {pathname:k};},
  async get(k){const v=mem.get(k);return v?{statusCode:200,stream:new Response(v.buf).body,blob:{size:v.buf.length}}:null;},
  async list({prefix=''}){return {blobs:[...mem].filter(([k])=>k.startsWith(prefix)).map(([pathname,v])=>({pathname,uploadedAt:v.uploadedAt})),hasMore:false};},
  async del(keys){for(const k of Array.isArray(keys)?keys:[keys])mem.delete(k);}
};
require.cache[require.resolve('@vercel/blob')]={exports:mock};
Object.assign(process.env,{ADMIN_PASSWORD:'test',ADMIN_SECRET:'partner-test-secret-at-least-32',BLOB_READ_WRITE_TOKEN:'test',BLOB_ACCESS:'private'});
delete process.env.TELEGRAM_BOT_TOKEN;delete process.env.TELEGRAM_CHAT_ID;
const endpoint=require('../api/contact');const auth=require('../api/_lib/auth');const service=require('../api/_lib/partners');const ws=require('../api/_lib/ws');
let checks=0;
function check(label,condition){assert.ok(condition,label);checks++;console.log('PASS '+label);}
async function call(p,token=''){
 let result;const res={statusCode:200,setHeader(){},end(s){result={status:this.statusCode,...JSON.parse(s)};}};
 await endpoint({method:'POST',query:{partner:'1'},body:p,headers:{authorization:token?'Bearer '+token:'','x-forwarded-for':'127.0.0.3'}},res);return result;
}
(async()=>{
 const token=await auth.issue(Date.now()+3600000),reviewer=auth.sign({role:'reviewer',v:0,exp:Date.now()+3600000});
 const submit={action:'submit',key:'a'.repeat(64),version:service.notices.version,name:'Test Applicant',email:'test@example.invalid',contactMethod:'email',applicantType:'individual',role:'Developer',skills:'Software delivery',motivation:'Contribute to software projects',previousWork:'A demonstration portfolio',collaboration:'Project collaboration',areas:['Software Development'],truth:true,conditions:true,privacy:true};
 check('closed until privacy configuration',(await call(submit)).status===503);
 check('anonymous cannot configure',(await call({action:'configure'})).status===403);
 check('reviewer cannot change program settings',(await call({action:'configure',enabled:false,retentionDays:30},reviewer)).status===403);
 check('unknown role cannot list',(await call({action:'list'},auth.sign({role:'guest',v:0,exp:Date.now()+3600000}))).status===403);
 check('cannot open with missing legal contact',(await call({action:'configure',enabled:true,reviewed:true,retentionDays:30},token)).status===400);
 check('configure reviewed program',(await call({action:'configure',enabled:true,reviewed:true,organization:'Test fixture only',contact:'privacy@example.invalid',retentionDays:30},token)).ok);
 check('separate acknowledgement required',(await call({...submit,privacy:false})).status===400);
 check('notice version mismatch rejected',(await call({...submit,version:'old'})).status===409);
 check('unsafe evidence URL rejected',(await call({...submit,links:'javascript:alert(1)'})).status===400);
 failWrites=true;check('storage failure never reports success',(await call(submit)).status===500);failWrites=false;
 let a=await call(submit);check('persistent application confirmed',a.ok && a.record.status==='Submitted');let r=a.record;
 check('notice snapshot stored',r.notices.version===submit.version && r.acknowledgements.at);
 check('no automatic profile',r.profile===null);
 check('idempotent lost-response retry',(await call(submit)).record.id===r.id);
 const b=(await call({...submit,key:'b'.repeat(64),email:'second@example.invalid'})).record;
 check('cross-applicant read denied',(await call({action:'get',id:r.id,key:'b'.repeat(64)})).status===404);
 check('anonymous reference is insufficient',(await call({action:'get',id:r.id})).status===404);
 check('no application listing for applicants',(await call({action:'list',id:r.id,key:submit.key})).status===403);
 check('unsafe evidence file rejected',(await call({action:'evidence.upload',id:r.id,rev:r.rev,key:submit.key,name:'script.html',type:'text/html',data:Buffer.from('<script>bad</script>').toString('base64')})).status===400);
 const up=await call({action:'evidence.upload',id:r.id,rev:r.rev,key:submit.key,name:'evidence.txt',type:'text/plain',data:Buffer.from('Private sample evidence').toString('base64')});r=up.record;
 check('evidence upload persisted privately',up.ok && r.evidence.length===1);
 check('cross-applicant evidence download denied',(await call({action:'evidence.download',id:r.id,key:'b'.repeat(64),fileId:r.evidence[0].id})).status===404);
 check('authorized evidence download matches bytes',Buffer.from((await call({action:'evidence.download',id:r.id,key:submit.key,fileId:r.evidence[0].id})).file.data,'base64').toString()==='Private sample evidence');
 async function admin(action,p={}) {const out=await call({action,id:r.id,rev:r.rev,...p},token);assert.ok(out.ok,JSON.stringify(out));r=out.record;return out;}
 async function applicant(action,p={}) {const out=await call({action,id:r.id,rev:r.rev,key:submit.key,...p});assert.ok(out.ok,JSON.stringify(out));r=out.record;return out;}
 check('approval requires qualification',(await call({action:'status',id:r.id,rev:r.rev,status:'Approved',reason:'Test',role:'Developer'},token)).status===400);
 await admin('review',{reviewer:'Max',note:'Private assessment note',assessment:Object.fromEntries(['Relevant skills','Previous work','Problem solving','Communication','Reliability','Security awareness','Role fit'].map(k=>[k,'Reviewed evidence']))});
 const self=(await call({action:'get',id:r.id,key:submit.key})).record;
 check('internal notes and key hashes never exposed',!JSON.stringify(self).includes('Private assessment note') && !self.notes && !self.keyHash && !self.assessment);
 await admin('status',{status:'More Information Required',reason:'Please describe your contribution.'});
 await applicant('respond',{message:'Additional contribution evidence.'});
 check('applicant can answer information request',r.messages.at(-2).from==='applicant');
 check('an answer returns the application to review (event, not elapsed time)',r.status==='Under Review');
 await admin('status',{status:'Qualification',reason:'Evidence ready for evaluation.'});
 const stale=r.rev;
 await admin('task',{kind:'trial',title:'Small evaluation',scope:'One sample',deliverables:'One text response',existingIP:'Applicant retains existing work',permittedUse:'Review only',ip:'No transfer',compensation:'Unpaid evaluation, agreed before acceptance',confidentiality:'No confidential data supplied',criteria:'Explain approach',termination:'Either party may stop',due:'2026-12-01'});
 check('stale concurrent write rejected',(await call({action:'review',id:r.id,rev:stale},token)).status===409);
 const task=r.tasks[0];
 check('terms visible before acceptance',task.compensation && task.scope && !task.acceptedAt);
 check('submission requires explicit task acceptance',(await call({action:'task.submit',id:r.id,key:submit.key,rev:r.rev,taskId:task.id,evidence:'Evidence'})).status===400);
 await applicant('task.accept',{taskId:task.id});await applicant('task.submit',{taskId:task.id,evidence:'Completed sample and explanation.'});
 await admin('evaluate',{taskId:task.id,result:'passed',feedback:'Meets the stated criteria.'});
 await admin('status',{status:'Approved',reason:'Reviewed evidence and agreed responsibilities.',role:'Developer',agreements:'Separate written project agreements required.'});
 check('profile only after decision',r.profile && r.audit.at(-1).type==='decision');
 check('no automatic project access',r.profile.projects.length===0 && r.profile.steps.every(s=>!s.done));
 const p1=await ws.create('projects',{name:'Assigned',status:'ACTIVE',notes:'Private business data'}),p2=await ws.create('projects',{name:'Other',status:'ACTIVE'});
 await admin('access',{projects:[p1.id]});
 const allowed=await call({action:'project',id:r.id,key:submit.key,projectId:p1.id});
 check('explicit assignment grants only safe project summary',allowed.ok && allowed.project.name==='Assigned' && !allowed.project.notes);
 check('unassigned project denied',(await call({action:'project',id:r.id,key:submit.key,projectId:p2.id})).status===403);
 await admin('onboarding',{step:0,done:true});check('checklist reflects actual recorded action',r.profile.steps[0].done && !r.profile.steps[1].done);
 await admin('relationship',{status:'suspended',reason:'Security review.'});
 check('suspension immediately blocks project access',(await call({action:'project',id:r.id,key:submit.key,projectId:p1.id})).status===403);
 await applicant('privacy.request',{kind:'deletion',message:'Please erase my application.'});
 check('privacy request persisted',r.privacyRequest.kind==='deletion');
 check('erasure requires exact confirmation',(await call({action:'erase',id:r.id,rev:r.rev,confirm:'wrong'},token)).status===400);
 check('owner can erase requested record',(await call({action:'erase',id:r.id,rev:r.rev,confirm:r.id},token)).erased);
 check('all application revisions erased',![...mem.keys()].some(k=>k.startsWith('partners/records/'+r.id+'/')));
 check('deleted reference denied',(await call({action:'get',id:r.id,key:submit.key})).status===404);
 r=b;await admin('status',{status:'Declined',reason:'No current role fit.'});
 const currentPath=[...mem.keys()].filter(k=>k.startsWith('partners/records/'+r.id+'/')).sort().at(-1);
 const fixture=JSON.parse(mem.get(currentPath).buf);fixture.closedAt=new Date(Date.now()-31*864e5).toISOString();mem.get(currentPath).buf=Buffer.from(JSON.stringify(fixture));
 check('retention cleanup deletes expired closed application',(await call({action:'cleanup',confirm:true},token)).deleted===1);
 check('cleanup preserves anonymous maintenance evidence',[...mem.keys()].some(k=>k.startsWith('partners/maintenance/')));
 // roles, recommendation, optional consent, trial and unpaid-disclosure rules
 const manager=auth.sign({role:'manager',v:0,exp:Date.now()+3600000});
 const c0=await call({...submit,key:'c'.repeat(64),email:'third@example.invalid',updates:false});let c=c0.record;
 check('optional updates consent stored separately (declined here)',c.acknowledgements.updates.consented===false && c.acknowledgements.updates.optional && c.acknowledgements.conditions===true);
 async function as(tok,action,p={}) {const o=await call({action,id:c.id,rev:c.rev,...p},tok);if(o.ok)c=o.record;return o;}
 check('reviewer can list applications',(await call({action:'list'},reviewer)).ok);
 check('reviewer records a structured review and a recommendation',(await as(reviewer,'review',{reviewer:'Reviewer A',summary:'Strong evidence.',recommendation:'qualification',assessment:Object.fromEntries(['Relevant skills','Previous work','Problem solving','Communication','Reliability','Security awareness','Role fit'].map(k=>[k,{rating:3,note:'Seen in portfolio'}]))})).ok && c.reviews.at(-1).recommendation==='qualification' && c.assessment['Relevant skills'].rating===3);
 check('applicant never sees reviews, ratings or the reviewer',(s=>!s.reviews && !s.assessment && !s.reviewer && !JSON.stringify(s).includes('Strong evidence'))((await call({action:'get',id:c.id,key:'c'.repeat(64)})).record));
 check('reviewer can advance to qualification',(await as(reviewer,'status',{status:'Qualification',reason:'Evidence looks relevant.'})).ok && c.status==='Qualification');
 check('trial stage needs a defined trial task first',(await as(manager,'status',{status:'Trial Collaboration',reason:'Try a trial.'})).status===400);
 const terms={kind:'evaluation',title:'Short exercise',scope:'One page',deliverables:'Written answer',existingIP:'Applicant keeps own work',permittedUse:'Review only',ip:'No transfer',confidentiality:'Public data only',criteria:'Clear reasoning',termination:'Either side may stop'};
 check('an unpaid task must say “Unpaid” before it can be assigned',(await as(reviewer,'task',{...terms,compensation:'None'})).status===400);
 check('task with disclosed unpaid status assigned',(await as(reviewer,'task',{...terms,compensation:'Unpaid evaluation, agreed before acceptance'})).ok && c.tasks.length===1);
 check('reviewer cannot record a final decision',(await as(reviewer,'status',{status:'Declined',reason:'x'})).status===403);
 check('reviewer cannot change partner access or erase',(await as(reviewer,'access',{projects:[]})).status===403 && (await as(reviewer,'erase',{confirm:c.id})).status===403);
 check('reviewer cannot use the project picker',(await call({action:'projects'},reviewer)).status===403);
 check('manager sees the project picker (names and status only)',(o=>o.ok && o.projects.every(x=>Object.keys(x).join()==='id,name,status'))(await call({action:'projects'},manager)));
 check('manager records a decision with a reason',(await as(manager,'status',{status:'Declined',reason:'No current role fit.'})).ok && c.decision.status==='Declined' && c.decision.by==='manager');
 check('a closed application can only be reopened for review',(await as(manager,'status',{status:'Qualification',reason:'x'})).status===400);
 check('reopening needs a decision-maker and a reason',(await as(reviewer,'status',{status:'Under Review',reason:'New evidence'})).status===403 && (await as(manager,'status',{status:'Under Review',reason:'New evidence'})).ok);
 check('applicant can change the optional consent later',(o=>o.ok && o.record.acknowledgements.updates.consented===true)(await call({action:'consent',id:c.id,rev:c.rev,key:'c'.repeat(64),updates:true})));
 check('no certificates created',![...mem.keys()].some(k=>k.startsWith('ws/certs/')));
 console.log('ALL '+checks+' PARTNER TESTS PASSED');
})().catch(e=>{console.error(e);process.exitCode=1;});

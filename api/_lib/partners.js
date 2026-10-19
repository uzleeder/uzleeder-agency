// Partner records use immutable private Blob revisions. A conditional create on the next
// revision prevents concurrent reviewers from overwriting decisions. No certificate path.
const crypto = require('crypto');
const store = require('./store');
const auth = require('./auth');
const ws = require('./ws');
const notices = require('./partner-notices.json');
const { json, body, client } = require('./http');
const { getJSON, putJSON, listAll, blob } = store._raw;
const STATES = ['Submitted','Under Review','More Information Required','Qualification','Trial Collaboration','Approved','Declined','Withdrawn','Closed'];
const AREAS = ['Software Development','AI & Automation','Product Design','Research & Development','Startup Collaboration','Marketing & Growth','Business Development','Content & Media','Other'];
const RUBRIC = ['Relevant skills','Previous work','Problem solving','Communication','Reliability','Security awareness','Role fit'];
const STEPS = ['Review guidelines','Complete agreements','Confirm responsibilities','Security training','Configure account','Review least-privilege access','Assign first project'];
const RECOMMEND = ['', 'more-information', 'qualification', 'trial', 'approve', 'decline'];
// Server-side roles. "admin" is the owner account; managers run the program; reviewers assess but never decide.
const PERMS = {
  admin: ['view','review','advance','task','evaluate','decide','onboard','access','relationship','hold','configure','cleanup','erase'],
  manager: ['view','review','advance','task','evaluate','decide','onboard','access','relationship','hold'],
  reviewer: ['view','review','advance','task','evaluate']
};
const can = (who, perm) => !!who && (PERMS[who.role] || []).includes(perm);
const actorOf = who => (who && who.name) || (who && who.role === 'admin' ? 'Max' : (who && who.role) || 'staff');
const DECISIONS = ['Approved','Declined','Closed'];
const now = () => new Date().toISOString();
const hash = v => crypto.createHash('sha256').update(String(v)).digest('hex');
const text = (v, max=4000) => typeof v === 'string' ? v.trim().slice(0,max) : '';
const need = (v,m,status=400) => { if (!v) { const e=new Error(m); e.status=status; throw e; } };
const idOk = id => /^UP-\d{4}-[A-F0-9]{24}$/.test(id || '');
const root = id => 'partners/records/'+id+'/';
async function config() { return Object.assign({ enabled:false, organization:'', contact:'', retentionDays:180, reviewed:false, steps:STEPS, areas:AREAS }, await getJSON('partners/config.json') || {}); }
// structured qualitative review: rating 1–4 (0 = not assessed) + a written observation per criterion
function criterion(v) {
  if (typeof v === 'string') return { rating: 0, note: text(v, 1000) };
  const rating = Number(v && v.rating);
  return { rating: Number.isInteger(rating) && rating >= 0 && rating <= 4 ? rating : 0, note: text(v && v.note, 1000) };
}
const assessed = c => c && ((typeof c === 'string' && c) || c.rating > 0 || c.note);
async function current(id) {
  need(idOk(id),'Application not found',404);
  need(!await getJSON('partners/deleted/'+hash(id)+'.json'),'Application not found',404);
  const paths=await listAll(root(id),10000);
  const latest=paths.map(x=>x.pathname).filter(x=>/\/\d{8}\.json$/.test(x)).sort().pop();
  const r=latest && await getJSON(latest); need(r,'Application not found',404); return r;
}
async function commit(r, type, actor, detail='') {
  need(!await getJSON('partners/deleted/'+hash(r.id)+'.json'),'Application no longer exists',410);
  r.rev=(r.rev || 0)+1; r.updatedAt=now();
  r.audit=(r.audit||[]).concat({at:r.updatedAt,actor,type,detail});
  try { await putJSON(root(r.id)+String(r.rev).padStart(8,'0')+'.json',r,false); }
  catch(e) { if (/already exists|overwrite|conflict/i.test(e.message)) need(false,'Record changed. Reload before trying again.',409); throw e; }
  return r;
}
function visible(r) {
  return { id:r.id,rev:r.rev,status:r.status,createdAt:r.createdAt,updatedAt:r.updatedAt,application:r.application,
    acknowledgements:r.acknowledgements,messages:r.messages,tasks:(r.tasks||[]).map(({internal,...task})=>task),
    profile:r.profile?(({reviewHistory,...pr})=>pr)(r.profile):null,notices:r.notices,privacyRequest:r.privacyRequest,notification:r.notification,evidence:r.evidence||[],
    history:r.audit.filter(e=>['submitted','response','withdrawn','decision','status','task','task.accepted','task.submitted','task.evaluated','onboarding','access','relationship','privacy.request','consent','evidence.added','agreements'].includes(e.type)).map(({at,type})=>({at,type})) };
}
function application(p, areas = AREAS) {
  const a={};
  for (const k of ['name','email','contactMethod','contactDetail','location','applicantType','organization','authority','role','links','skills','motivation','previousWork','availability','collaboration','additional']) a[k]=text(p[k],['name','email','role','organization'].includes(k)?200:4000);
  a.email=a.email.toLowerCase();
  need(a.name.length>=2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email),'Name and valid email are required.');
  need(['individual','team','organization'].includes(a.applicantType),'Select applicant type.');
  need(['email','telegram','phone'].includes(a.contactMethod),'Select contact method.');
  need(a.contactMethod==='email' || a.contactDetail.length>=3,'Provide the selected contact detail.');
  need(a.applicantType==='individual' || (a.organization && a.authority),'Organization/team name and representative authority are required.');
  for (const k of ['role','skills','motivation','previousWork','collaboration']) need(a[k].length>=3,'Complete '+k+'.');
  a.areas=Array.isArray(p.areas)?[...new Set(p.areas)].filter(x=>areas.includes(x)):[];
  need(a.areas.length,'Select contribution areas.');
  for(const link of a.links.split(/\s+/).filter(Boolean)) { let u; try{u=new URL(link);}catch{} need(u && u.protocol==='https:' && !u.username && !u.password,'Evidence links must use HTTPS without credentials.'); }
  return a;
}
async function rate(req) {
  const bucket=hash((client(req).ip||'unknown')+':'+Math.floor(Date.now()/3600000));
  for(let slot=0;slot<30;slot++) {
    try { await putJSON('partners/rate/'+bucket+'/'+slot+'.json',{expires:Date.now()+7200000},false); return; }
    catch(e) { if(!/already exists|overwrite|conflict/i.test(e.message)) throw e; }
  }
  need(false,'Too many attempts. Please try again later.',429);
}
async function dispatch(p,req) {
  need(store.configured() && store.accessMode()==='private','Private storage must be configured.',503);
  const cfg=await config();
  const who=await auth.requireAuth(req);
  const staff=!!who && !!PERMS[who.role];
  const allow=perm=>need(can(who,perm),'Your role does not allow this.',403);
  const action=text(p.action,40);
  if(action==='info') return {config:{enabled:cfg.enabled,organization:cfg.organization,contact:cfg.contact,retentionDays:cfg.retentionDays},notices,areas:cfg.areas,states:STATES,rubric:RUBRIC,recommendations:RECOMMEND.filter(Boolean)};
  if(action==='me') return {staff,role:staff?who.role:null,perms:staff?PERMS[who.role]:[]};
  if(action==='submit') {
    await rate(req);
    need(cfg.enabled && cfg.reviewed && cfg.organization && cfg.contact,'Applications are not open. Program privacy configuration and review are required.',503);
    need(!p.website,'Submission rejected.');
    need(p.truth===true && p.conditions===true && p.privacy===true,'Separate acknowledgements are required.');
    need(p.version===notices.version,'Notices changed. Review the current notices.',409);
    need(/^[a-f0-9]{64}$/.test(p.key||''),'A secure tracking key is required.');
    const a=application(p,cfg.areas), keyHash=hash(p.key);
    const id='UP-'+new Date().getUTCFullYear()+'-'+hash(keyHash).slice(0,24).toUpperCase();
    // Stable reference makes a lost response safe to retry with the same client key.
    let prior; try {prior=await current(id);} catch(e) {if(e.status!==404)throw e;}
    if(prior) {need(prior.keyHash===keyHash,'Not found',404);return {record:visible(prior),duplicate:true};}
    const at=now();
    // required acknowledgements and the OPTIONAL updates consent are recorded separately, each with the notice version
    const r={id,keyHash,rev:0,status:'Submitted',createdAt:at,application:a,
      acknowledgements:{version:notices.version,at,truth:true,conditions:true,privacy:true,updates:{consented:p.updates===true,at,optional:true}},
      notices:{...notices,organization:cfg.organization,contact:cfg.contact,retentionDays:cfg.retentionDays},messages:[],tasks:[],notes:[],reviews:[],audit:[],notification:'not-configured',profile:null};
    await commit(r,'submitted','applicant');
    // Submission is already durable; notification failures cannot turn it into a lost application.
    const sent=await require('./notify').telegram('Partner application received: <code>'+id+'</code>').catch(()=> 'failed');
    if(sent!=='not-configured') {r.notification=sent;try{await commit(r,'reviewer.notification','system',sent);}catch{}}
    return {record:visible(r)};
  }
  if(action==='config') { allow('view'); return {config:cfg,steps:STEPS,areas:AREAS}; }
  if(action==='configure') {
    allow('configure');
    const next={organization:text(p.organization,200),contact:text(p.contact,200),retentionDays:Number(p.retentionDays),reviewed:p.reviewed===true,enabled:p.enabled===true,
      steps:Array.isArray(p.steps)?p.steps.map(x=>text(x,160)).filter(Boolean).slice(0,20):cfg.steps,
      areas:Array.isArray(p.areas)?[...new Set(p.areas.map(x=>text(x,60)).filter(Boolean))].slice(0,20):cfg.areas};
    need(next.retentionDays>=1 && next.retentionDays<=730,'Retention must be 1–730 days.');
    need(next.areas.length,'Keep at least one contribution area.');
    need(!next.enabled || (next.organization && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.contact) && next.reviewed),'Before opening, configure the responsible organization, email and legal/privacy review.');
    await putJSON('partners/config-history/'+Date.now()+'-'+crypto.randomBytes(6).toString('hex')+'.json',{...next,actor:actorOf(who),at:now()},false);
    await putJSON('partners/config.json',next); return {config:next};
  }
  if(action==='projects') { allow('access'); return {projects:(await ws.list('projects')).filter(x=>x.status!=='ARCHIVED').map(x=>({id:x.id,name:x.name,status:x.status}))}; }
  if(action==='list' || action==='cleanup') {
    allow(action==='cleanup'?'cleanup':'view');
    const paths=await listAll('partners/records/',10000);
    const ids=[...new Set(paths.map(x=>x.pathname.split('/')[2]))];
    const records=[]; for(const id of ids) {try{records.push(await current(id));}catch(e){if(e.status!==404)throw e;}}
    if(action==='cleanup') {
      need(p.confirm===true,'Confirm retention cleanup.');let count=0;
      for(const r of records) if(r.closedAt && Date.now()-Date.parse(r.closedAt)>cfg.retentionDays*864e5 && !(r.hold && Date.parse(r.hold.until)>Date.now())) {
        await putJSON('partners/deleted/'+hash(r.id)+'.json',{at:now()},false);
        await blob().del(paths.filter(x=>x.pathname.startsWith(root(r.id))).map(x=>x.pathname));count++;
      }
      const rates=await listAll('partners/rate/',10000);
      for(const x of rates) if(Date.now()-Date.parse(x.uploadedAt)>7200000) await blob().del(x.pathname);
      await putJSON('partners/maintenance/'+Date.now()+'.json',{at:now(),actor:actorOf(who),deleted:count},false);return {deleted:count};
    }
    const q=text(p.q,200).toLowerCase();
    const filtered=records.filter(r=>(!p.status || r.status===p.status) && (!p.type || r.application.applicantType===p.type) && [r.id,r.application.name,r.application.organization,r.application.role,(r.application.areas||[]).join(' ')].join(' ').toLowerCase().includes(q));
    const sort=['createdAt','updatedAt','name','status'].includes(p.sort)?p.sort:'updatedAt';
    filtered.sort((a,b)=>sort==='name'?a.application.name.localeCompare(b.application.name):sort==='status'?STATES.indexOf(a.status)-STATES.indexOf(b.status):b[sort].localeCompare(a[sort]));
    const page=Math.max(1,Math.floor(Number(p.page)||1));
    const due=records.filter(r=>r.closedAt && Date.now()-Date.parse(r.closedAt)>cfg.retentionDays*864e5 && !(r.hold && Date.parse(r.hold.until)>Date.now())).length;
    return {total:filtered.length,page,retentionDue:due,counts:Object.fromEntries(STATES.map(s=>[s,records.filter(r=>r.status===s).length])),
      records:filtered.slice((page-1)*25,page*25).map(r=>({id:r.id,name:r.application.name,organization:r.application.organization,type:r.application.applicantType,role:r.application.role,areas:r.application.areas,status:r.status,reviewer:r.reviewer||'',createdAt:r.createdAt,updatedAt:r.updatedAt,lastActivity:(r.audit.at(-1)||{}).type||'',partner:r.profile?{id:r.profile.id,status:r.profile.status}:null}))};
  }
  const r=await current(p.id);
  const self=/^[a-f0-9]{64}$/.test(p.key||'') && auth.safeEqual(hash(p.key),r.keyHash);
  need((staff && can(who,'view')) || self,'Application not found',404);
  const staffView=staff && !self;
  const out=()=>({record:staffView?{...r,keyHash:undefined}:visible(r)});
  if(action==='get') return out();
  if(action==='evidence.download') {
    const f=(r.evidence||[]).find(x=>x.id===p.fileId);need(f,'File not found',404);
    const stored=await blob().get(root(r.id)+'files/'+f.id,{access:'private',useCache:false});need(stored && stored.stream,'File not found',404);
    const bytes=Buffer.from(await new Response(stored.stream).arrayBuffer());
    return {file:{name:f.name,type:f.type,data:bytes.toString('base64')}};
  }
  if(action==='project') {
    need(r.profile && r.profile.status==='active' && r.status==='Approved','Partner access is inactive.',403);
    need(r.profile.projects.includes(p.projectId),'Project access denied.',403);
    const project=await ws.get('projects',p.projectId);need(project,'Project not found',404);
    return {project:{id:project.id,name:project.name,status:project.status}}; // explicit safe projection, no client data or internal notes
  }
  need(Number(p.rev)===r.rev,'Record changed. Reload before trying again.',409);
  const actor=staffView?actorOf(who):'applicant';
  let event=action;
  if(action==='evidence.upload') {
    need(!['Declined','Withdrawn','Closed'].includes(r.status),'This application is closed.');
    need((r.evidence||[]).length<12,'Maximum 12 evidence files per application.');
    const name=text(p.name,160).replace(/[\\/\x00-\x1f]/g,'_'),type=text(p.type,100);
    need(typeof p.data==='string' && /^[A-Za-z0-9+/]*={0,2}$/.test(p.data),'Invalid file data.');
    const bytes=Buffer.from(p.data,'base64');need(bytes.length>0 && bytes.length<=1024*1024,'Evidence files must be at most 1 MB.');
    const valid=(type==='application/pdf' && /\.pdf$/i.test(name) && bytes.subarray(0,5).toString()==='%PDF-') ||
      (type==='image/png' && /\.png$/i.test(name) && bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) ||
      (type==='image/jpeg' && /\.jpe?g$/i.test(name) && bytes[0]===255 && bytes[1]===216 && bytes[2]===255) ||
      (type==='text/plain' && /\.txt$/i.test(name) && !bytes.includes(0));
    need(valid,'Use a valid PDF, PNG, JPEG or plain .txt file.');
    const f={id:crypto.randomUUID(),name,type,size:bytes.length,at:now(),actor};const pathname=root(r.id)+'files/'+f.id;
    await blob().put(pathname,bytes,{access:'private',addRandomSuffix:false,allowOverwrite:false,contentType:type});
    r.evidence=(r.evidence||[]).concat(f);
    try{await commit(r,'evidence.added',actor);}catch(e){await blob().del(pathname);throw e;}
    return out();
  }
  if(['respond','withdraw','privacy.request','task.accept','task.submit','consent'].includes(action)) {
    need(self || (staffView && action==='respond' && can(who,'review')),'Access denied',403);
    if(action==='respond') { need(text(p.message),'Write a response.');r.messages.push({at:now(),from:staffView?'UzLeeder':'applicant',text:text(p.message)});event='response';
      // an applicant's answer to an information request goes back to the reviewers (an event, never elapsed time)
      if(self && r.status==='More Information Required') {r.status='Under Review';r.messages.push({at:now(),from:'system',text:'Your response was received and returned to review.'});} }
    if(action==='withdraw') {need(r.status!=='Approved','For active partnerships request closure through the program contact.');need(!['Withdrawn','Closed','Declined'].includes(r.status),'This application is already closed.');r.status='Withdrawn';r.closedAt=now();event='withdrawn';}
    if(action==='privacy.request') {need(['access','correction','deletion'].includes(p.kind),'Select request type.');r.privacyRequest={kind:p.kind,message:text(p.message),at:now(),status:'pending'};}
    if(action==='consent') {r.acknowledgements.updates={consented:p.updates===true,at:now(),optional:true};event='consent';}
    if(action.startsWith('task.')) {
      const t=r.tasks.find(x=>x.id===p.taskId);need(t,'Task not found',404);
      need(['Qualification','Trial Collaboration'].includes(r.status),'Task stage is not active.',409);
      if(action==='task.accept') {need(!t.acceptedAt,'Task terms already accepted.');t.acceptedAt=now();event='task.accepted';}
      else {need(t.acceptedAt,'Review and accept task terms before starting.');need(text(p.evidence),'Provide evidence.');t.submission={evidence:text(p.evidence),at:now()};event='task.submitted';}
    }
  } else {
    need(staffView,'Staff access required.',403);
    if(action==='review') {
      allow('review');
      if(p.reviewer!==undefined) r.reviewer=text(p.reviewer,200);
      if(text(p.note)) r.notes.push({at:now(),actor,text:text(p.note)});
      if(p.assessment) r.assessment=Object.fromEntries(RUBRIC.map(k=>[k,criterion((p.assessment||{})[k])]));
      const rec=RECOMMEND.includes(p.recommendation)?p.recommendation:'';
      if(rec || text(p.summary)) (r.reviews=r.reviews||[]).push({at:now(),by:actor,recommendation:rec,summary:text(p.summary,2000)});
      event='review';
    } else if(action==='status') {
      need(STATES.includes(p.status) && p.status!=='Submitted','Invalid stage.');need(text(p.reason),'Record a reason.');
      need(p.status!==r.status,'The application is already in this stage.');
      const closed=['Declined','Withdrawn','Closed'].includes(r.status);
      allow(DECISIONS.includes(p.status) || closed || r.status==='Approved' ? 'decide' : 'advance');
      need(!closed || p.status==='Under Review','A closed application can only be reopened for review.');
      need(r.status!=='Approved' || p.status==='Closed','An approved partnership is managed through its relationship status, or closed.');
      need(p.status!=='Withdrawn','Only the applicant can withdraw.');
      if(p.status==='Trial Collaboration') need(r.tasks.some(t=>t.kind==='trial'),'Define a trial task with its terms before starting a trial collaboration.');
      if(p.status==='Approved') {
        need(['Qualification','Trial Collaboration'].includes(r.status),'Complete qualification before approval.');
        need(r.assessment && RUBRIC.every(k=>assessed(r.assessment[k])),'Complete all qualitative review criteria before approval.');
        need(text(p.role),'Specify approved role.');
        need(r.tasks.every(t=>t.result==='passed' || t.result==='waived'),'Resolve qualification tasks before approval.');
        r.profile={id:'PARTNER-'+r.id.slice(3),role:text(p.role,200),areas:r.application.areas,projects:[],permissions:['assigned-project-summary:read'],agreements:text(p.agreements),team:text(p.team,200),steps:cfg.steps.map(title=>({title,done:false})),status:'active',startDate:now(),reviewHistory:(r.reviews||[]).map(x=>({at:x.at,by:x.by,recommendation:x.recommendation}))};
      }
      if(DECISIONS.includes(p.status) || closed) { event='decision'; r.decision={status:p.status,reason:text(p.reason),by:actor,at:now()}; } else event='status';
      r.status=p.status;
      if(p.status!=='Approved' && r.profile && r.profile.status==='active')r.profile.status='suspended';
      r.closedAt=['Declined','Withdrawn','Closed'].includes(p.status)?now():null;
      r.messages.push({at:now(),from:'UzLeeder',text:p.status+': '+text(p.reason)});
    } else if(action==='task') {
      allow('task');
      need(['Qualification','Trial Collaboration'].includes(r.status),'Choose qualification or trial stage.');
      const t={id:crypto.randomUUID(),kind:p.kind};need(['evaluation','trial','production'].includes(t.kind),'Select task kind.');
      need(t.kind!=='production','Production work requires a separately approved project agreement; use the project workflow.');
      for(const k of ['title','scope','deliverables','existingIP','permittedUse','ip','compensation','confidentiality','criteria','termination']) {t[k]=text(p[k]);need(t[k],'Task terms required: '+k);}
      t.paid=p.paid===true;
      need(t.paid || /unpaid/i.test(t.compensation),'For an unpaid task, say “Unpaid” in the compensation terms so the applicant sees it before accepting.');
      t.due=text(p.due,20); t.result='pending'; t.createdBy=actor; r.tasks.push(t);event='task';
    } else if(action==='evaluate') {
      allow('evaluate');
      const t=r.tasks.find(x=>x.id===p.taskId);need(t,'Task not found',404);
      need(['passed','changes-required','failed','waived'].includes(p.result) && text(p.feedback),'Result and feedback required.');
      need(p.result==='waived' || t.submission,'Submission required before evaluation.');
      t.result=p.result;t.feedback=text(p.feedback);t.evaluatedAt=now();t.evaluatedBy=actor;event='task.evaluated';
    } else if(action==='onboarding') {
      allow('onboard');
      need(r.profile,'Approval required.'); const step=r.profile.steps[Number(p.step)];need(step,'Step not found');step.done=p.done===true;step.at=now();step.actor=actor;
    } else if(action==='agreements') {
      allow('onboard');
      need(r.profile,'Approval required.');
      r.profile.agreements=text(p.agreements,2000);
    } else if(action==='access') {
      allow('access');
      need(r.profile && r.status==='Approved' && r.profile.status==='active','Active approval required.');
      const ids=[...new Set(Array.isArray(p.projects)?p.projects:[])];need(ids.length<=30,'Too many projects.');
      for(const id of ids) need(ws.okId(id) && await ws.get('projects',id),'Unknown project.');
      r.profile.projects=ids;
    } else if(action==='relationship') {
      allow('relationship');
      need(r.profile && ['active','suspended','ended'].includes(p.status) && text(p.reason),'Relationship status and reason required.');
      need(p.status!=='active' || r.status==='Approved','Approval required.');r.profile.status=p.status;
      r.closedAt=p.status==='ended'?now():null;r.messages.push({at:now(),from:'UzLeeder',text:'Partnership '+p.status+': '+text(p.reason)});
    } else if(action==='hold') {
      allow('hold');
      need(text(p.reason) && Date.parse(p.until)>Date.now() && Date.parse(p.until)<Date.now()+366*864e5,'Document a reason and hold expiry within one year.');r.hold={reason:text(p.reason),until:p.until};
    } else if(action==='erase') {
      allow('erase');
      need(p.confirm===r.id,'Type the application reference to confirm deletion.');
      need(!(r.hold && Date.parse(r.hold.until)>Date.now()),'Resolve lawful hold before deletion.');
      await putJSON('partners/deleted/'+hash(r.id)+'.json',{at:now()},false);
      await blob().del((await listAll(root(r.id),10000)).map(x=>x.pathname));
      await putJSON('partners/maintenance/'+crypto.randomUUID()+'.json',{at:now(),actor,action:'privacy.erased'},false);return {erased:true};
    } else need(false,'Unknown action.');
  }
  await commit(r,event,actor);
  return out();
}
async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Robots-Tag','noindex');
  if(req.method!=='POST')return json(res,405,{ok:false,error:'POST required'});
  try {
    const p=await body(req);need(p && typeof p==='object' && JSON.stringify(p).length<(p.action==='evidence.upload'?1450000:60000),'Request is too large.');
    return json(res,200,{ok:true,...await dispatch(p,req)});
  }catch(e){return json(res,e.status||500,{ok:false,error:e.status?e.message:'Partner operation failed. Please retry.'});}
}
module.exports={handler,dispatch,visible,current,notices};

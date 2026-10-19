/* Partner Program UI — one module, three modes:
   admin      (Control Center → Partners): review, rubric, recommendations, decisions, program settings
   workspace  (Workspace → Partners):     qualification tasks, trials, onboarding, project access, relationship
   applicant  (/workspace/partners):      the applicant's own record only, opened with reference + private key
   Every rule is enforced by the server (api/_lib/partners.js); buttons only mirror the signed-in role. */
window.PartnerUI = (() => {
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const when = iso => { if (!iso) return '—'; const d = new Date(iso); return isNaN(d) ? esc(iso) : d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); };
  const day = iso => { if (!iso) return '—'; const d = new Date(iso.length === 10 ? iso + 'T00:00:00' : iso); return isNaN(d) ? esc(iso) : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); };
  const STATUS_CLS = { 'Submitted': 'info', 'Under Review': 'info', 'More Information Required': 'warn', 'Qualification': 'gold', 'Trial Collaboration': 'gold', 'Approved': 'ok', 'Declined': 'bad', 'Withdrawn': '', 'Closed': '' };
  const PATH = ['Submitted', 'Under Review', 'Qualification', 'Trial Collaboration', 'Approved'];
  const REC = { 'more-information': 'Request more information', qualification: 'Move to qualification', trial: 'Offer a trial collaboration', approve: 'Approve', decline: 'Decline' };
  const RESULT = { pending: 'Waiting for submission', passed: 'Passed', 'changes-required': 'Changes required', failed: 'Not passed', waived: 'Waived' };
  const TERMS = [['scope', 'Scope'], ['deliverables', 'Deliverables'], ['compensation', 'Compensation'], ['existingIP', 'Existing intellectual property'], ['ip', 'Ownership / licensing of new work'], ['permittedUse', 'Permitted use of materials'], ['confidentiality', 'Confidentiality'], ['criteria', 'Acceptance criteria'], ['termination', 'Termination']];
  const APP = [['name', 'Name'], ['email', 'Email'], ['applicantType', 'Applying as'], ['organization', 'Team / organization'], ['authority', 'Authority to apply'], ['role', 'Role / expertise'], ['location', 'Location'], ['contactMethod', 'Preferred contact'], ['contactDetail', 'Telegram / phone'], ['areas', 'Contribution areas'], ['skills', 'Skills and experience'], ['previousWork', 'Previous work'], ['links', 'Links'], ['motivation', 'Motivation and contribution'], ['collaboration', 'Collaboration type'], ['availability', 'Availability'], ['additional', 'Additional information']];
  const EVENT = { submitted: 'Application submitted', response: 'Message added', withdrawn: 'Application withdrawn', decision: 'Decision recorded', status: 'Stage changed', task: 'Qualification task assigned', 'task.accepted': 'Task terms accepted', 'task.submitted': 'Task evidence submitted', 'task.evaluated': 'Task evaluated', onboarding: 'Onboarding step updated', access: 'Project access changed', relationship: 'Partnership status changed', 'privacy.request': 'Privacy request made', consent: 'Optional consent changed', 'evidence.added': 'Evidence file added', review: 'Review recorded', agreements: 'Agreements updated', hold: 'Retention hold recorded', 'reviewer.notification': 'Reviewer notification' };
  const pill = (s, cls) => '<span class="pill ' + (cls == null ? (STATUS_CLS[s] || '') : cls) + '"><i></i>' + esc(s) + '</span>';
  const links = s => String(s || '').split(/\s+/).filter(Boolean).map(u => /^https:\/\//.test(u) ? '<a href="' + esc(u) + '" target="_blank" rel="noopener noreferrer nofollow">' + esc(u) + '</a>' : esc(u)).join('<br>');

  async function request(payload, token) {
    let r; try { r = await fetch('/api/contact?partner=1', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: JSON.stringify(payload) }); }
    catch (e) { throw new Error('Network error — check your connection and try again.'); }
    const j = await r.json().catch(() => ({ ok: false, error: 'Unexpected server response (' + r.status + ').' }));
    if (!r.ok || !j.ok) { const e = new Error(j.error || 'Request failed'); e.status = r.status; throw e; }
    return j;
  }

  /* ---------- accessible in-page dialog (no browser popups) ---------- */
  function dialog(title, body, { ok = 'Save', danger = false, onSubmit, wide = false } = {}) {
    return new Promise(resolve => {
      const ov = document.createElement('div'); ov.className = 'pp-overlay';
      ov.innerHTML = '<div class="pp-dialog' + (wide ? ' wide' : '') + '" role="dialog" aria-modal="true" aria-labelledby="ppDlgT"><h3 id="ppDlgT">' + esc(title) + '</h3><form novalidate>' + body +
        '<div class="pp-alert" role="alert" hidden></div><div class="pp-dlg-acts"><button type="button" class="btn btn-ghost" data-x>Cancel</button><button type="submit" class="btn ' + (danger ? 'btn-danger pp-danger' : 'btn-primary') + '">' + esc(ok) + '</button></div></form></div>';
      const prev = document.activeElement, form = ov.querySelector('form'), alert = ov.querySelector('.pp-alert');
      const close = v => { ov.remove(); document.removeEventListener('keydown', key, true); if (prev && prev.focus) prev.focus(); resolve(v); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(null); } if (e.key === 'Tab') { const f = [...ov.querySelectorAll('button,input,select,textarea,a[href]')].filter(x => !x.disabled); if (!f.length) return; if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); } else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); } } };
      ov.addEventListener('click', e => { if (e.target === ov || e.target.closest('[data-x]')) close(null); });
      form.addEventListener('submit', async e => {
        e.preventDefault(); const btn = form.querySelector('[type=submit]'); btn.disabled = true; alert.hidden = true;
        const data = Object.fromEntries(new FormData(form)); form.querySelectorAll('input[type=checkbox]').forEach(c => { if (!c.name.endsWith('[]')) data[c.name] = c.checked; });
        form.querySelectorAll('input[type=checkbox][name$="[]"]').forEach(c => { const k = c.name.slice(0, -2); data[k] = data[k] || []; if (c.checked) data[k].push(c.value); });
        try { const v = onSubmit ? await onSubmit(data) : data; close(v === undefined ? true : v); }
        catch (err) { alert.hidden = false; alert.textContent = err.message; btn.disabled = false; }
      });
      document.addEventListener('keydown', key, true); document.body.appendChild(ov);
      (ov.querySelector('input:not([type=hidden]),select,textarea') || ov.querySelector('[type=submit]')).focus();
    });
  }
  const inp = (name, label, { type = 'text', value = '', required = false, hint = '', rows = 3, options = null, max = 4000 } = {}) => {
    const id = 'pp-d-' + name.replace(/\W/g, '');
    const ctl = options ? '<select id="' + id + '" name="' + name + '"' + (required ? ' required' : '') + '>' + options.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return '<option value="' + esc(v) + '"' + (String(v) === String(value) ? ' selected' : '') + '>' + esc(l) + '</option>'; }).join('') + '</select>'
      : type === 'textarea' ? '<textarea id="' + id + '" name="' + name + '" rows="' + rows + '" maxlength="' + max + '"' + (required ? ' required' : '') + '>' + esc(value) + '</textarea>'
      : type === 'checkbox' ? '<input id="' + id + '" name="' + name + '" type="checkbox"' + (value ? ' checked' : '') + '/>'
      : '<input id="' + id + '" name="' + name + '" type="' + type + '" value="' + esc(value) + '" maxlength="' + max + '"' + (required ? ' required' : '') + '/>';
    return type === 'checkbox' ? '<label class="pp-check pp-d-row" for="' + id + '">' + ctl + '<span>' + esc(label) + '</span></label>'
      : '<div class="pp-d-row"><label for="' + id + '">' + esc(label) + (required ? ' <span class="pp-req">*</span>' : '') + '</label>' + ctl + (hint ? '<p class="pp-hint">' + esc(hint) + '</p>' : '') + '</div>';
  };

  async function mount(el, opts = {}) {
    const mode = opts.applicant ? 'applicant' : (opts.mode || 'admin'), token = opts.token || '';
    el.classList.add('pp', 'pp-' + mode);
    let info, me = { perms: [] }, record = null, list = { q: '', status: '', type: '', sort: 'updatedAt', page: 1, tab: mode === 'workspace' ? 'qualification' : 'all' }, id = '', key = '', projectsCache = null;
    const can = p => me.perms.includes(p);
    const api = p => request(mode === 'applicant' ? { ...p, id, key } : p, token);
    const frame = html => { el.innerHTML = '<div class="pp-alert pp-top" role="alert" hidden></div>' + html; };
    const fail = e => { const b = el.querySelector('.pp-top'); if (b) { b.hidden = false; b.textContent = e.message; b.scrollIntoView({ block: 'nearest' }); } };
    const act = (a, label, cls = 'btn-ghost') => '<button type="button" class="btn ' + cls + ' btn-sm" data-a="' + a + '">' + esc(label) + '</button>';
    async function save(action, p = {}) { const j = await api({ action, id: record.id, rev: record.rev, ...p }); if (j.erased) { record = null; return listView(); } record = j.record; detail(); return j; }
    async function reload() { record = (await api({ action: 'get', id: record.id })).record; detail(); }

    /* ---------- list (admin + workspace) ---------- */
    async function listView() {
      record = null;
      frame('<p class="pp-muted">Loading applications…</p>');
      let j; try { j = await api({ action: 'list', ...list, status: list.tab === 'qualification' ? '' : list.status }); } catch (e) { return frame('<div class="pp-closed" role="alert"><h3>Partners unavailable</h3><p>' + esc(e.message) + '</p></div>'); }
      let rows = j.records;
      if (mode === 'workspace' && list.tab === 'qualification') rows = rows.filter(r => ['Qualification', 'Trial Collaboration'].includes(r.status));
      if (mode === 'workspace' && list.tab === 'partners') rows = rows.filter(r => r.partner);
      const title = mode === 'workspace' ? 'Partners — operations' : 'Partner applications';
      const sub = mode === 'workspace' ? 'Qualification tasks, trial collaborations, onboarding and least-privilege project access for approved partners. Review and decisions happen in the Control Center.'
        : 'Review applications, record assessments and recommendations, and make recorded decisions. Qualification tasks and onboarding run in the Workspace. No certificates are issued here.';
      frame('<div class="pp-head"><div><h2>' + title + '</h2><p class="pp-muted">' + sub + '</p></div><div class="pp-acts">' +
        (mode === 'admin' && can('configure') ? act('settings', 'Program settings') : '') + (mode === 'admin' && can('cleanup') ? act('cleanup', 'Retention cleanup' + (j.retentionDue ? ' (' + j.retentionDue + ' due)' : '')) : '') + '</div></div>' +
        (mode === 'admin' && !info.config.enabled ? '<div class="pp-note warn"><b>Applications are closed.</b> Configure the responsible organization and privacy contact, confirm the legal/privacy review, then open applications in Program settings.</div>' : '') +
        (mode === 'workspace' ? '<div class="pp-tabs" role="tablist">' + [['qualification', 'Qualification & trials'], ['partners', 'Partners'], ['all', 'All applications']].map(([k, l]) => '<button role="tab" type="button" data-tab="' + k + '" aria-selected="' + (list.tab === k) + '">' + l + '</button>').join('') + '</div>'
          : '<div class="pp-counts">' + info.states.map(s => '<button type="button" data-st="' + esc(s) + '" class="pp-count' + (list.status === s ? ' on' : '') + '" aria-pressed="' + (list.status === s) + '"><b>' + (j.counts[s] || 0) + '</b><span>' + esc(s) + '</span></button>').join('') + '</div>') +
        '<form class="pp-filters" role="search"><label class="pp-grow"><span class="pp-vh">Search</span><input name="q" type="search" placeholder="Reference, name, organization, expertise" value="' + esc(list.q) + '"/></label>' +
        (mode === 'admin' ? '<label><span class="pp-vh">Status</span><select name="status"><option value="">Any status</option>' + info.states.map(s => '<option' + (s === list.status ? ' selected' : '') + '>' + esc(s) + '</option>').join('') + '</select></label>' : '') +
        '<label><span class="pp-vh">Applicant type</span><select name="type"><option value="">Any type</option>' + ['individual', 'team', 'organization'].map(t => '<option value="' + t + '"' + (t === list.type ? ' selected' : '') + '>' + t[0].toUpperCase() + t.slice(1) + '</option>').join('') + '</select></label>' +
        '<label><span class="pp-vh">Sort</span><select name="sort">' + [['updatedAt', 'Last activity'], ['createdAt', 'Newest submitted'], ['name', 'Name A–Z'], ['status', 'Stage']].map(([v, l]) => '<option value="' + v + '"' + (v === list.sort ? ' selected' : '') + '>' + l + '</option>').join('') + '</select></label><button class="btn btn-ghost btn-sm">Apply</button></form>' +
        (!rows.length ? '<div class="pp-empty"><b>' + (j.total ? 'Nothing matches these filters' : mode === 'workspace' && list.tab !== 'all' ? 'Nothing here yet' : 'No applications yet') + '</b><p>' + (mode === 'workspace' && list.tab === 'qualification' ? 'Applications appear here once a reviewer moves them to Qualification or Trial Collaboration.' : mode === 'workspace' && list.tab === 'partners' ? 'Partner profiles appear only after an authorized approval decision.' : 'Applications from /partners appear here.') + '</p></div>'
          : '<div class="pp-table"><table><thead><tr><th>Reference / applicant</th><th>Type · expertise</th><th>Submitted</th><th>Stage</th><th>Reviewer</th><th>Last activity</th></tr></thead><tbody>' +
            rows.map(r => '<tr><td><button type="button" class="pp-linkbtn" data-open="' + esc(r.id) + '">' + esc(r.name) + (r.organization ? ' · ' + esc(r.organization) : '') + '</button><div class="pp-mono pp-muted">' + esc(r.id) + '</div></td><td>' + esc(r.type) + '<div class="pp-muted">' + esc(r.role) + '</div></td><td>' + day(r.createdAt) + '</td><td>' + pill(r.status) + (r.partner ? '<div class="pp-muted">' + esc(r.partner.id) + ' · ' + esc(r.partner.status) + '</div>' : '') + '</td><td>' + esc(r.reviewer || '—') + '</td><td>' + esc(EVENT[r.lastActivity] || r.lastActivity) + '<div class="pp-muted">' + when(r.updatedAt) + '</div></td></tr>').join('') + '</tbody></table></div>' +
            '<div class="pp-pager"><span class="pp-muted">' + j.total + ' application' + (j.total === 1 ? '' : 's') + ' · page ' + j.page + ' of ' + Math.max(1, Math.ceil(j.total / 25)) + '</span>' + (j.page > 1 ? act('prev', '← Previous') : '') + (j.page * 25 < j.total ? act('next', 'Next →') : '') + '</div>'));
      const f = el.querySelector('.pp-filters');
      f.onsubmit = e => { e.preventDefault(); const d = Object.fromEntries(new FormData(f)); Object.assign(list, { q: d.q || '', status: d.status || '', type: d.type || '', sort: d.sort, page: 1 }); listView(); };
      el.querySelectorAll('[data-st]').forEach(b => b.onclick = () => { list.status = list.status === b.dataset.st ? '' : b.dataset.st; list.page = 1; listView(); });
      el.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { list.tab = b.dataset.tab; list.page = 1; listView(); });
      el.querySelectorAll('[data-open]').forEach(b => b.onclick = async () => { try { record = (await api({ action: 'get', id: b.dataset.open })).record; detail(); window.scrollTo(0, 0); } catch (e) { fail(e); } });
      bind({ prev: () => { list.page--; listView(); }, next: () => { list.page++; listView(); }, settings, cleanup });
    }
    function bind(map) { el.querySelectorAll('[data-a]').forEach(b => { if (map[b.dataset.a]) b.onclick = async () => { try { await map[b.dataset.a](b); } catch (e) { fail(e); } }; }); }

    async function settings() {
      const j = await api({ action: 'config' }), c = j.config;
      const ok = await dialog('Partner Program settings', '<p class="pp-muted">Applications open only when the responsible organization, privacy contact and a confirmed legal/privacy review are recorded. Every change is kept in the settings history.</p>' +
        inp('organization', 'Responsible organization (verified legal or trading name)', { value: c.organization, required: true }) + inp('contact', 'Privacy contact email', { type: 'email', value: c.contact, required: true }) +
        inp('retentionDays', 'Keep closed applications for (days, 1–730)', { type: 'number', value: c.retentionDays }) +
        inp('areas', 'Contribution areas shown on the form (one per line)', { type: 'textarea', value: (c.areas || []).join('\n'), rows: 6 }) +
        inp('steps', 'Onboarding checklist for new partners (one step per line)', { type: 'textarea', value: (c.steps || []).join('\n'), rows: 6 }) +
        inp('reviewed', 'The conditions, privacy notice and data processing have been reviewed for the applicable jurisdiction', { type: 'checkbox', value: c.reviewed }) +
        inp('enabled', 'Open applications on /partners', { type: 'checkbox', value: c.enabled }),
        { wide: true, ok: 'Save settings', onSubmit: d => api({ action: 'configure', organization: d.organization, contact: d.contact, retentionDays: Number(d.retentionDays), reviewed: d.reviewed, enabled: d.enabled, areas: d.areas.split('\n'), steps: d.steps.split('\n') }) });
      if (ok) { info = await request({ action: 'info' }, token); listView(); }
    }
    async function cleanup() {
      const r = await dialog('Run retention cleanup', '<p>Closed applications older than the retention period (and without a documented legal hold) are <b>permanently deleted</b>, including their files and history. An anonymous maintenance record is kept.</p>' + inp('confirm', 'I understand this cannot be undone', { type: 'checkbox' }),
        { ok: 'Delete expired records', danger: true, onSubmit: d => { if (!d.confirm) throw new Error('Tick the confirmation first.'); return api({ action: 'cleanup', confirm: true }); } });
      if (r) { listView(); }
    }

    /* ---------- detail ---------- */
    function pathHTML(r) {
      const closed = ['Declined', 'Withdrawn', 'Closed'].includes(r.status);
      const cur = r.status === 'More Information Required' ? 1 : PATH.indexOf(r.status);
      return '<ol class="pp-path" aria-label="Application stage">' + PATH.map((s, i) => '<li class="' + (closed ? '' : i < cur ? 'done' : i === cur ? 'now' : '') + '"' + (i === cur && !closed ? ' aria-current="step"' : '') + '>' + esc(s) + '</li>').join('') + '</ol>' +
        (r.status === 'More Information Required' ? '<p class="pp-note warn">More information has been requested' + (mode === 'applicant' ? ' — please reply below.' : ' from the applicant.') + '</p>' : '') +
        (closed ? '<p class="pp-note">This application is <b>' + esc(r.status.toLowerCase()) + '</b>.</p>' : '');
    }
    function section(title, body, extra = '') { return body ? '<section class="pp-sec"><div class="pp-sec-h"><h3>' + title + '</h3>' + extra + '</div>' + body + '</section>' : ''; }
    function tasksHTML(r) {
      if (!r.tasks.length) return mode === 'applicant' ? '' : '<p class="pp-muted">No qualification tasks yet.' + (['Qualification', 'Trial Collaboration'].includes(r.status) ? '' : ' Tasks can be assigned once the application is in Qualification or Trial Collaboration.') + '</p>';
      return r.tasks.map(t => '<article class="pp-task"><div class="pp-sec-h"><h4>' + esc(t.title) + '</h4>' + pill(t.kind === 'trial' ? 'Trial collaboration' : 'Evaluation task', 'gold') + pill(RESULT[t.result] || t.result, t.result === 'passed' ? 'ok' : t.result === 'failed' ? 'bad' : t.result === 'changes-required' ? 'warn' : '') + '</div>' +
        '<p class="pp-muted">' + (t.paid ? 'Paid' : 'Unpaid') + (t.due ? ' · due ' + day(t.due) : '') + (t.acceptedAt ? ' · terms accepted ' + when(t.acceptedAt) : ' · terms not yet accepted') + '</p>' +
        '<dl class="pp-dl compact">' + TERMS.map(([k, l]) => t[k] ? '<div><dt>' + l + '</dt><dd>' + esc(t[k]) + '</dd></div>' : '').join('') + '</dl>' +
        (t.submission ? '<div class="pp-sub"><b>Submitted ' + when(t.submission.at) + '</b><p>' + links(t.submission.evidence).replace(/\n/g, '<br>') + '</p></div>' : '') +
        (t.feedback ? '<div class="pp-sub"><b>Feedback</b><p>' + esc(t.feedback) + '</p></div>' : '') +
        '<div class="pp-acts">' + (mode === 'applicant' && ['Qualification', 'Trial Collaboration'].includes(r.status) ? (!t.acceptedAt ? '<button type="button" class="btn btn-primary btn-sm" data-accept="' + esc(t.id) + '">Accept these terms</button>' : !t.submission || t.result === 'changes-required' ? '<button type="button" class="btn btn-primary btn-sm" data-submit="' + esc(t.id) + '">Submit evidence</button>' : '') : '') +
          (mode !== 'applicant' && can('evaluate') && t.result !== 'passed' && t.result !== 'waived' ? '<button type="button" class="btn btn-ghost btn-sm" data-eval="' + esc(t.id) + '">Evaluate</button>' : '') + '</div></article>').join('');
    }
    function timeline(items) { return '<ol class="pp-timeline">' + items.slice().reverse().map(e => '<li><span class="pp-muted">' + when(e.at) + '</span><b>' + esc(EVENT[e.type] || e.type) + '</b>' + (e.actor && mode !== 'applicant' ? ' · ' + esc(e.actor) : '') + (e.detail ? '<span class="pp-muted"> — ' + esc(e.detail) + '</span>' : '') + '</li>').join('') + '</ol>'; }

    function detail() {
      const r = record, p = r.profile, a = r.application, staff = mode !== 'applicant';
      const isClosed = ['Declined', 'Withdrawn', 'Closed'].includes(r.status);
      const acts = [];
      if (mode === 'admin') {
        if (can('review')) acts.push(act('review', 'Assess & recommend', 'btn-primary'));
        if (can('advance') && !isClosed && r.status !== 'Approved') acts.push(act('info', 'Request information'), act('advance', 'Move to stage'));
        if (can('decide') && !isClosed && r.status !== 'Approved') acts.push(act('decide', 'Record decision'));
        if (can('decide') && isClosed) acts.push(act('reopen', 'Reopen for review'));
        if (can('decide') && r.status === 'Approved') acts.push(act('close', 'Close application'));
        if (can('hold')) acts.push(act('hold', 'Legal hold'));
        if (can('erase')) acts.push(act('erase', 'Erase…', 'btn-danger pp-danger'));
      }
      if (mode === 'workspace') {
        if (can('task') && ['Qualification', 'Trial Collaboration'].includes(r.status)) acts.push(act('task', 'Assign task', 'btn-primary'));
        if (p && can('onboard')) acts.push(act('agreements', 'Agreements'));
        if (p && can('access') && p.status === 'active') acts.push(act('access', 'Project access'));
        if (p && can('relationship')) acts.push(act('relationship', 'Partnership status'));
      }
      if (mode === 'applicant') {
        if (!isClosed) acts.push(act('respond', r.status === 'More Information Required' ? 'Reply to the request' : 'Send a message or correction', 'btn-primary'));
        acts.push(act('consent', 'Optional consent'), act('privacy', 'Privacy request'));
        if (!isClosed && r.status !== 'Approved') acts.push(act('withdraw', 'Withdraw application', 'btn-ghost pp-danger'));
        acts.push(act('signout', 'Forget access on this device'));
      }
      const ack = r.acknowledgements || {}, upd = ack.updates || {};
      frame((staff ? '<p><button type="button" class="btn btn-ghost btn-sm" data-a="back">← All applications</button></p>' : '') +
        '<div class="pp-head"><div><p class="pp-mono pp-muted">' + esc(r.id) + '</p><h2>' + esc(a.name) + (a.organization ? ' <span class="pp-muted">· ' + esc(a.organization) + '</span>' : '') + '</h2><p>' + pill(r.status) + ' <span class="pp-muted">Submitted ' + when(r.createdAt) + ' · updated ' + when(r.updatedAt) + '</span></p></div></div>' +
        pathHTML(r) + (acts.length ? '<div class="pp-acts pp-actbar">' + acts.join('') + '</div>' : '') +
        (r.decision && staff ? section('Decision', '<p>' + pill(r.decision.status) + ' ' + when(r.decision.at) + ' · ' + esc(r.decision.by) + '</p><p>' + esc(r.decision.reason) + '</p>') : '') +
        section(mode === 'applicant' ? 'Messages' : 'Applicant-visible messages', (r.messages.length ? '<ol class="pp-msgs">' + r.messages.map(m => '<li class="from-' + esc(m.from) + '"><span class="pp-muted">' + esc(m.from === 'applicant' ? (mode === 'applicant' ? 'You' : 'Applicant') : m.from === 'system' ? 'Update' : 'UzLeeder') + ' · ' + when(m.at) + '</span><p>' + esc(m.text) + '</p></li>').join('') + '</ol>' : '<p class="pp-muted">No messages yet.</p>'), staff && can('review') && mode === 'admin' ? act('reply', 'Message the applicant') : '') +
        section('Qualification tasks', tasksHTML(r)) +
        (p ? section(staff ? 'Partner profile' : 'Your partnership', '<dl class="pp-dl compact"><div><dt>Partner ID</dt><dd class="pp-mono">' + esc(p.id) + '</dd></div><div><dt>Approved role</dt><dd>' + esc(p.role) + '</dd></div><div><dt>Status</dt><dd>' + pill(p.status, p.status === 'active' ? 'ok' : p.status === 'suspended' ? 'warn' : '') + '</dd></div><div><dt>Start date</dt><dd>' + day(p.startDate) + '</dd></div><div><dt>Areas</dt><dd>' + esc((p.areas || []).join(', ')) + '</dd></div>' + (p.team ? '<div><dt>Team</dt><dd>' + esc(p.team) + '</dd></div>' : '') + '<div><dt>Agreements</dt><dd>' + esc(p.agreements || 'Not recorded yet') + '</dd></div></dl>' +
          '<h4>Onboarding</h4><ul class="pp-steps-list">' + p.steps.map((s, i) => '<li class="' + (s.done ? 'done' : '') + '">' + (mode === 'workspace' && can('onboard') ? '<label class="pp-check"><input type="checkbox" data-step="' + i + '"' + (s.done ? ' checked' : '') + '/><span>' + esc(s.title) + '</span></label>' : '<span aria-hidden="true">' + (s.done ? '✓' : '○') + '</span> ' + esc(s.title) + '<span class="pp-vh">' + (s.done ? ' (done)' : ' (not done)') + '</span>') + (s.done && s.at ? ' <span class="pp-muted">' + day(s.at) + (staff && s.actor ? ' · ' + esc(s.actor) : '') + '</span>' : '') + '</li>').join('') + '</ul>' +
          '<h4>Assigned projects</h4><div id="ppProjects">' + (p.projects.length ? '<p class="pp-muted">Loading…</p>' : '<p class="pp-muted">No project access granted. Access is never automatic — only explicitly assigned project summaries are visible.</p>') + '</div>') : '') +
        section('Application', '<dl class="pp-dl">' + APP.map(([k, l]) => { let v = a[k]; if (!v || (Array.isArray(v) && !v.length)) return ''; if (k === 'links') return '<div><dt>' + l + '</dt><dd>' + links(v) + '</dd></div>'; return '<div><dt>' + l + '</dt><dd>' + esc(Array.isArray(v) ? v.join(', ') : v) + '</dd></div>'; }).join('') + '</dl>') +
        section('Evidence files', ((r.evidence || []).length ? '<ul class="pp-files">' + r.evidence.map(f => '<li><button type="button" class="pp-linkbtn" data-file="' + esc(f.id) + '">' + esc(f.name) + '</button> <span class="pp-muted">' + Math.max(1, Math.round(f.size / 1024)) + ' KB · ' + when(f.at) + '</span></li>').join('') + '</ul>' : '<p class="pp-muted">No files.</p>') +
          (!isClosed ? '<label class="pp-upload">Add a file (PDF, PNG, JPEG or .txt, up to 1 MB)<input type="file" id="ppEvidence" accept=".pdf,.png,.jpg,.jpeg,.txt"/></label>' : '')) +
        section('Acknowledgements', '<dl class="pp-dl compact"><div><dt>Notice version</dt><dd>' + esc(ack.version) + '</dd></div><div><dt>Truthfulness, conditions, privacy</dt><dd>Acknowledged ' + when(ack.at) + '</dd></div><div><dt>Optional: future opportunities</dt><dd>' + (upd.consented ? 'Consented' : 'Not consented') + (upd.at ? ' · ' + when(upd.at) : '') + '</dd></div></dl>') +
        (staff ? section('Private review <span class="pill"><i></i>internal</span>', '<p class="pp-muted">Never shown to the applicant. Ratings are a structured aid for reviewers — they do not prove character, trustworthiness or future success.</p><p>Assigned reviewer: <b>' + esc(r.reviewer || 'Unassigned') + '</b></p>' +
          (r.assessment ? '<div class="pp-table"><table class="pp-rubric"><thead><tr><th>Criterion</th><th>Rating</th><th>Observation</th></tr></thead><tbody>' + info.rubric.map(k => { const c = r.assessment[k] || {}; const o = typeof c === 'string' ? { note: c } : c; return '<tr><td>' + esc(k) + '</td><td>' + (o.rating ? o.rating + ' / 4' : '—') + '</td><td>' + esc(o.note || '') + '</td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="pp-muted">No assessment recorded yet.</p>') +
          ((r.reviews || []).length ? '<h4>Recommendations</h4><ul class="pp-recs">' + r.reviews.map(x => '<li><span class="pp-muted">' + when(x.at) + ' · ' + esc(x.by) + '</span>' + (x.recommendation ? ' ' + pill(REC[x.recommendation] || x.recommendation, 'gold') : '') + (x.summary ? '<p>' + esc(x.summary) + '</p>' : '') + '</li>').join('') + '</ul>' : '') +
          ((r.notes || []).length ? '<h4>Internal notes</h4><ul class="pp-recs">' + r.notes.map(n => '<li><span class="pp-muted">' + when(n.at) + ' · ' + esc(n.actor) + '</span><p>' + esc(n.text) + '</p></li>').join('') + '</ul>' : '') +
          (r.hold ? '<p class="pp-note warn">Legal hold until ' + day(r.hold.until) + ': ' + esc(r.hold.reason) + '</p>' : '') +
          (r.privacyRequest ? '<p class="pp-note warn">Privacy request (' + esc(r.privacyRequest.kind) + ', ' + when(r.privacyRequest.at) + '): ' + esc(r.privacyRequest.message) + '</p>' : '')) : '') +
        section('History', timeline(staff ? r.audit : r.history)) +
        '<details class="pp-sec"><summary>Conditions and privacy notice you ' + (staff ? 'saw (as accepted)' : 'accepted') + '</summary>' + noticesHTML({ notices: r.notices, config: r.notices }) + '</details>');

      bind({
        back: listView, signout: () => { try { sessionStorage.removeItem('uz_partner_access'); } catch (e) {} id = ''; key = ''; login(); },
        review: async () => { const s = record.assessment || {}; await dialog('Assessment and recommendation', '<p class="pp-muted">Rate what the evidence shows (1 = weak, 4 = strong) and write what you observed. Reviews are private.</p>' + inp('reviewer', 'Assigned reviewer', { value: record.reviewer || '' }) +
          info.rubric.map((k, i) => { const c = typeof s[k] === 'string' ? { note: s[k] } : (s[k] || {}); return '<div class="pp-rub-row"><b>' + esc(k) + '</b>' + inp('rating' + i, 'Rating', { options: [['0', 'Not assessed'], ['1', '1 — weak'], ['2', '2'], ['3', '3'], ['4', '4 — strong']], value: String(c.rating || 0) }) + inp('note' + i, 'Observation', { type: 'textarea', rows: 2, value: c.note || '' }) + '</div>'; }).join('') +
          inp('recommendation', 'Recommendation', { options: [['', 'No recommendation yet'], ...Object.entries(REC)] }) + inp('summary', 'Summary for the decision-maker', { type: 'textarea' }) + inp('note', 'Private note', { type: 'textarea' }),
          { wide: true, ok: 'Save review', onSubmit: d => save('review', { reviewer: d.reviewer, recommendation: d.recommendation, summary: d.summary, note: d.note, assessment: Object.fromEntries(info.rubric.map((k, i) => [k, { rating: Number(d['rating' + i]), note: d['note' + i] }])) }) }); },
        info: () => dialog('Request more information', inp('reason', 'What do you need from the applicant? (shown to them)', { type: 'textarea', required: true }), { ok: 'Send request', onSubmit: d => save('status', { status: 'More Information Required', reason: d.reason }) }),
        advance: () => dialog('Move to another stage', inp('status', 'Next stage', { options: ['Under Review', 'Qualification', 'Trial Collaboration'].filter(s => s !== record.status) }) + inp('reason', 'Reason (shown to the applicant)', { type: 'textarea', required: true }), { ok: 'Move', onSubmit: d => save('status', d) }),
        decide: () => dialog('Record a decision', '<p class="pp-muted">The decision, its reason, your name and the time are recorded and the reason is shown to the applicant. Approval creates a partner profile with <b>no</b> project access.</p>' +
          inp('status', 'Decision', { options: ['Approved', 'Declined', 'Closed'] }) + inp('reason', 'Reason (shown to the applicant)', { type: 'textarea', required: true }) +
          inp('role', 'Approved role (approval only)') + inp('agreements', 'Applicable agreements (approval only)', { type: 'textarea', hint: 'e.g. project agreement and NDA required before access' }) + inp('team', 'Assigned team (optional)'),
          { ok: 'Record decision', onSubmit: d => save('status', d) }),
        reopen: () => dialog('Reopen for review', inp('reason', 'Why is it reopened? (shown to the applicant)', { type: 'textarea', required: true }), { ok: 'Reopen', onSubmit: d => save('status', { status: 'Under Review', reason: d.reason }) }),
        close: () => dialog('Close this application', inp('reason', 'Reason (shown to the applicant)', { type: 'textarea', required: true }), { ok: 'Close', danger: true, onSubmit: d => save('status', { status: 'Closed', reason: d.reason }) }),
        reply: () => dialog('Message the applicant', inp('message', 'Message (visible to the applicant)', { type: 'textarea', required: true, rows: 5 }), { ok: 'Send', onSubmit: d => save('respond', d) }),
        hold: () => dialog('Time-limited legal hold', '<p class="pp-muted">Prevents deletion until the date below. Only for a documented legal reason.</p>' + inp('reason', 'Legal reason', { type: 'textarea', required: true }) + inp('until', 'Hold until', { type: 'date', required: true }), { onSubmit: d => save('hold', d) }),
        erase: () => dialog('Permanently erase this application', '<p>This deletes the application, its files and its history. It cannot be undone. Type <b class="pp-mono">' + esc(record.id) + '</b> to confirm.</p>' + inp('confirm', 'Application reference', { required: true }), { ok: 'Erase permanently', danger: true, onSubmit: d => save('erase', { confirm: d.confirm.trim() }) }),
        task: () => dialog('Assign a qualification task', '<p class="pp-muted">All terms are shown to the applicant, who must accept them before starting. Production work is never assigned here.</p>' +
          inp('kind', 'Kind', { options: [['evaluation', 'Evaluation task'], ['trial', 'Trial collaboration']] }) + inp('title', 'Title', { required: true }) + inp('paid', 'This task is paid', { type: 'checkbox' }) +
          inp('compensation', 'Compensation', { type: 'textarea', required: true, hint: 'If unpaid, write “Unpaid” and explain — the applicant must see it before accepting.' }) +
          TERMS.filter(([k]) => k !== 'compensation').map(([k, l]) => inp(k, l, { type: 'textarea', required: true, rows: 2 })).join('') + inp('due', 'Due date', { type: 'date' }),
          { wide: true, ok: 'Assign task', onSubmit: d => save('task', d) }),
        agreements: () => dialog('Agreements', inp('agreements', 'Applicable agreements and their status', { type: 'textarea', value: record.profile.agreements || '', rows: 4 }), { onSubmit: d => save('agreements', d) }),
        access: async () => { projectsCache = projectsCache || (await api({ action: 'projects' })).projects; const cur = record.profile.projects;
          await dialog('Project access (least privilege)', '<p class="pp-muted">The partner sees only the name and status of the projects ticked here — no client data, files or internal notes.</p>' + (projectsCache.length ? '<div class="pp-check-grid">' + projectsCache.map(x => '<label class="pp-check"><input type="checkbox" name="projects[]" value="' + esc(x.id) + '"' + (cur.includes(x.id) ? ' checked' : '') + '/><span>' + esc(x.name) + ' <span class="pp-muted">' + esc(x.status || '') + '</span></span></label>').join('') + '</div>' : '<p>No projects in the Workspace yet.</p>'),
            { ok: 'Save access', onSubmit: d => save('access', { projects: d.projects || [] }) }); },
        relationship: () => dialog('Partnership status', '<p class="pp-muted">Suspending or ending removes project access immediately. The reason is shown to the partner.</p>' + inp('status', 'Status', { options: ['active', 'suspended', 'ended'], value: record.profile.status }) + inp('reason', 'Reason', { type: 'textarea', required: true }), { onSubmit: d => save('relationship', d) }),
        respond: () => dialog(record.status === 'More Information Required' ? 'Reply to the information request' : 'Message or correction', inp('message', 'Your message', { type: 'textarea', required: true, rows: 6 }), { ok: 'Send', onSubmit: d => save('respond', d) }),
        consent: () => dialog('Optional consent', inp('updates', 'Contact me about future collaboration opportunities (optional)', { type: 'checkbox', value: (record.acknowledgements.updates || {}).consented }), { onSubmit: d => save('consent', { updates: d.updates }) }),
        privacy: () => dialog('Privacy request', '<p class="pp-muted">Ask to see, correct or delete your information. The program contact handles it.</p>' + inp('kind', 'Request', { options: [['access', 'Access my information'], ['correction', 'Correct my information'], ['deletion', 'Delete my information']] }) + inp('message', 'Details', { type: 'textarea' }), { ok: 'Send request', onSubmit: d => save('privacy.request', d) }),
        withdraw: () => dialog('Withdraw your application?', '<p>Your application will be closed. It is kept for the stated retention period, then deleted.</p>', { ok: 'Withdraw', danger: true, onSubmit: () => save('withdraw') })
      });
      el.querySelectorAll('[data-step]').forEach(c => c.onchange = () => save('onboarding', { step: Number(c.dataset.step), done: c.checked }).catch(e => { c.checked = !c.checked; fail(e); }));
      el.querySelectorAll('[data-accept]').forEach(b => b.onclick = () => dialog('Accept the task terms', '<p>By accepting, you confirm you have read the scope, compensation, intellectual-property, confidentiality, acceptance and termination terms shown for this task.</p>', { ok: 'Accept terms', onSubmit: () => save('task.accept', { taskId: b.dataset.accept }) }).catch(fail));
      el.querySelectorAll('[data-submit]').forEach(b => b.onclick = () => dialog('Submit your evidence', inp('evidence', 'Your work: explanation and https:// links', { type: 'textarea', required: true, rows: 6 }), { ok: 'Submit', onSubmit: d => save('task.submit', { taskId: b.dataset.submit, evidence: d.evidence }) }).catch(fail));
      el.querySelectorAll('[data-eval]').forEach(b => b.onclick = () => dialog('Evaluate the task', inp('result', 'Result', { options: [['passed', 'Passed'], ['changes-required', 'Changes required'], ['failed', 'Not passed'], ['waived', 'Waived']] }) + inp('feedback', 'Feedback (shown to the applicant)', { type: 'textarea', required: true }), { onSubmit: d => save('evaluate', { taskId: b.dataset.eval, ...d }) }).catch(fail));
      el.querySelectorAll('[data-file]').forEach(b => b.onclick = async () => { try { const { file } = await api({ action: 'evidence.download', id: record.id, fileId: b.dataset.file }); const bytes = Uint8Array.from(atob(file.data), c => c.charCodeAt(0)); const url = URL.createObjectURL(new Blob([bytes], { type: 'application/octet-stream' })); const x = document.createElement('a'); x.href = url; x.download = file.name; document.body.appendChild(x); x.click(); x.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000); } catch (e) { fail(e); } });
      const up = el.querySelector('#ppEvidence');
      if (up) up.onchange = async () => { const f = up.files[0]; if (!f) return; try { if (f.size > 1024 * 1024) throw new Error('Files must be at most 1 MB.'); up.disabled = true; const data = await new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result).split(',')[1]); fr.onerror = rej; fr.readAsDataURL(f); }); await save('evidence.upload', { name: f.name, type: f.type || (/\.txt$/i.test(f.name) ? 'text/plain' : ''), data }); } catch (e) { fail(e); up.disabled = false; } };
      const box = el.querySelector('#ppProjects');
      if (box && p && p.projects.length) {
        if (mode === 'applicant' && (p.status !== 'active' || r.status !== 'Approved')) box.innerHTML = '<p class="pp-muted">Project access is paused while the partnership is ' + esc(p.status) + '.</p>';
        else if (mode === 'applicant') Promise.all(p.projects.map(pid => api({ action: 'project', projectId: pid }).then(j => j.project).catch(() => null))).then(list => { box.innerHTML = list.some(Boolean) ? '<ul class="pp-files">' + list.filter(Boolean).map(x => '<li>' + esc(x.name) + ' <span class="pp-muted">' + esc(x.status || '') + '</span></li>').join('') + '</ul>' : '<p class="pp-muted">Project access is not active right now.</p>'; });
        else (projectsCache ? Promise.resolve(projectsCache) : api({ action: 'projects' }).then(j => (projectsCache = j.projects))).then(all => { box.innerHTML = '<ul class="pp-files">' + p.projects.map(pid => { const x = all.find(y => y.id === pid); return '<li>' + esc(x ? x.name : pid) + (x ? ' <span class="pp-muted">' + esc(x.status || '') + '</span>' : '') + '</li>'; }).join('') + '</ul>'; }).catch(() => { box.innerHTML = '<p class="pp-muted">' + p.projects.length + ' project(s) assigned.</p>'; });
      }
    }

    /* ---------- applicant sign-in with reference + private key ---------- */
    function login() {
      frame('<div class="pp-head"><div><p class="su-k">Partner Program</p><h2>Your application</h2><p class="pp-muted">Enter your application reference and the private access key you saved when you applied. It opens only your own application — not the UzLeeder Workspace.</p></div></div>' +
        '<form class="contact-form pp-form pp-login" novalidate>' + inp('ref', 'Application reference', { required: true, hint: 'Looks like UP-2026-…' }) + inp('key', 'Private access key', { type: 'password', required: true }) +
        '<div class="pp-form-actions"><button class="btn btn-primary">Open my application</button><a href="/partners#apply" class="btn btn-ghost">Apply instead</a></div><p class="pp-muted">Lost your key? It cannot be recovered — contact the program contact listed in the privacy notice.</p></form>');
      const f = el.querySelector('form');
      f.onsubmit = async e => { e.preventDefault(); const d = Object.fromEntries(new FormData(f)); id = (d.ref || '').trim().toUpperCase(); key = (d.key || '').trim().toLowerCase();
        if (!id || !key) return fail(new Error('Enter both the reference and the key.'));
        try { record = (await api({ action: 'get' })).record; try { sessionStorage.setItem('uz_partner_access', JSON.stringify({ id, key })); } catch (x) {} detail(); } catch (err) { fail(err.status === 404 ? new Error('No application matches this reference and key. Check both values.') : err); } };
    }

    frame('<p class="pp-muted">Loading the Partner Program…</p>');
    try {
      info = await request({ action: 'info' }, token);
      if (mode === 'applicant') {
        let stored = null; try { stored = JSON.parse(sessionStorage.getItem('uz_partner_access') || 'null'); } catch (e) {}
        if (stored) { id = stored.id; key = stored.key; try { record = (await api({ action: 'get' })).record; return detail(); } catch (e) { try { sessionStorage.removeItem('uz_partner_access'); } catch (x) {} } }
        return login();
      }
      me = await request({ action: 'me' }, token);
      if (!me.staff) return frame('<div class="pp-closed"><h3>No access</h3><p>Your role cannot open the Partner Program.</p></div>');
      await listView();
    } catch (e) { frame('<div class="pp-closed" role="alert"><h3>Partner Program unavailable</h3><p>' + esc(e.message) + '</p></div>'); }
  }

  function noticesHTML(x) {
    const n = x.notices || {}, c = x.config || {};
    const block = (title, items) => '<h4>' + title + '</h4><ol class="pp-notice-list">' + (items || []).map(([h, t], i) => '<li><b>' + String.fromCharCode(65 + i) + ' — ' + esc(h) + '</b><p>' + esc(t) + '</p></li>').join('') + '</ol>';
    return '<p class="pp-muted">Version ' + esc(n.version) + ' · Responsible organization: ' + esc(c.organization || 'not configured') + ' · Contact: ' + esc(c.contact || 'not configured') + ' · Closed records kept ' + esc(c.retentionDays) + ' days</p>' + block('Partnership conditions', n.conditions) + block('Privacy notice', n.privacy);
  }
  return { mount, request, esc, noticesHTML, dialog };
})();

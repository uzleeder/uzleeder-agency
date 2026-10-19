// External integrations for the Workspace. Each one works only when its credentials are set
// on the server; otherwise it reports { configured:false } and the UI shows "Integration required".
//   GitHub       GITHUB_TOKEN (fine-grained, read-only: contents/metadata/actions), GITHUB_OWNER (optional)
//   Deployments  VERCEL_TOKEN, VERCEL_PROJECT (default "uzleeder"), VERCEL_TEAM_ID (optional)
//   YouTube      YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN (scope youtube.upload + youtube.readonly)
const env = k => process.env[k] || "";

async function getJSON(url, headers, opts) {
  let r;
  try { r = await fetch(url, Object.assign({ headers }, opts || {})); }
  catch (e) { return { ok: false, status: -1, error: "Network error: " + e.message }; }
  const data = await r.json().catch(() => null);
  if (!r.ok) return { ok: false, status: r.status, error: (data && (data.message || (data.error && (data.error.message || data.error)))) || "HTTP " + r.status };
  return { ok: true, data, headers: r.headers };
}

/* ---------- GitHub (read-only) ---------- */
const gh = {
  configured: () => !!env("GITHUB_TOKEN"),
  h: () => ({ Authorization: "Bearer " + env("GITHUB_TOKEN"), Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "uzleeder-workspace" }),
  async repos() {
    const owner = env("GITHUB_OWNER");
    const url = owner ? "https://api.github.com/users/" + encodeURIComponent(owner) + "/repos?sort=pushed&per_page=50" : "https://api.github.com/user/repos?sort=pushed&per_page=50&affiliation=owner";
    const r = await getJSON(url, gh.h());
    if (!r.ok) return r;
    return { ok: true, data: r.data.map(x => ({ full: x.full_name, name: x.name, private: x.private, url: x.html_url, branch: x.default_branch, pushedAt: x.pushed_at, language: x.language })) };
  },
  async repo(full) {
    if (!/^[\w.-]+\/[\w.-]+$/.test(full || "")) return { ok: false, error: "bad repository" };
    const base = "https://api.github.com/repos/" + full;
    const [branches, commits, runs] = await Promise.all([
      getJSON(base + "/branches?per_page=30", gh.h()),
      getJSON(base + "/commits?per_page=15", gh.h()),
      getJSON(base + "/actions/runs?per_page=10", gh.h())
    ]);
    if (!branches.ok) return branches;
    return { ok: true, data: {
      branches: branches.data.map(b => ({ name: b.name, sha: b.commit.sha.slice(0, 7), protected: b.protected })),
      commits: commits.ok ? commits.data.map(c => ({ sha: c.sha.slice(0, 7), message: String(c.commit.message).split("\n")[0].slice(0, 140), author: c.commit.author && c.commit.author.name, at: c.commit.author && c.commit.author.date, url: c.html_url })) : [],
      builds: runs.ok ? (runs.data.workflow_runs || []).map(w => ({ name: w.name, branch: w.head_branch, status: w.status, conclusion: w.conclusion, at: w.created_at, url: w.html_url })) : [],
      buildsError: runs.ok ? null : runs.error
    } };
  }
};

/* ---------- Vercel deployments ---------- */
const STATE = { QUEUED: "queued", INITIALIZING: "queued", BUILDING: "building", READY: "success", ERROR: "failed", CANCELED: "cancelled" };
const vc = {
  configured: () => !!env("VERCEL_TOKEN"),
  h: () => ({ Authorization: "Bearer " + env("VERCEL_TOKEN") }),
  q: extra => { const p = new URLSearchParams(extra || {}); if (env("VERCEL_TEAM_ID")) p.set("teamId", env("VERCEL_TEAM_ID")); const s = p.toString(); return s ? "?" + s : ""; },
  project: () => env("VERCEL_PROJECT") || "uzleeder",
  async list() {
    const proj = await getJSON("https://api.vercel.com/v9/projects/" + encodeURIComponent(vc.project()) + vc.q(), vc.h());
    if (!proj.ok) return proj;
    const r = await getJSON("https://api.vercel.com/v6/deployments" + vc.q({ projectId: proj.data.id, limit: "20" }), vc.h());
    if (!r.ok) return r;
    return { ok: true, data: { project: proj.data.name, projectId: proj.data.id, deployments: (r.data.deployments || []).map(d => ({
      id: d.uid, url: d.url ? "https://" + d.url : "", state: STATE[d.state || d.readyState] || String(d.state || d.readyState || "").toLowerCase(),
      target: d.target || "preview", at: new Date(d.created || d.createdAt).toISOString(), branch: d.meta && d.meta.githubCommitRef,
      commit: d.meta && d.meta.githubCommitMessage ? String(d.meta.githubCommitMessage).split("\n")[0].slice(0, 120) : "", inspector: d.inspectorUrl
    })) } };
  },
  async events(id) {
    if (!/^dpl_[A-Za-z0-9]+$/.test(id || "")) return { ok: false, error: "bad deployment id" };
    const r = await getJSON("https://api.vercel.com/v3/deployments/" + id + "/events" + vc.q({ limit: "200", direction: "backward" }), vc.h());
    if (!r.ok) return r;
    const lines = (Array.isArray(r.data) ? r.data : []).map(e => (e.payload && e.payload.text) || e.text || "").filter(Boolean).reverse();
    return { ok: true, data: lines.slice(-200) };
  },
  // "rollback": make an older successful production deployment current again
  async promote(id) {
    if (!/^dpl_[A-Za-z0-9]+$/.test(id || "")) return { ok: false, error: "bad deployment id" };
    const proj = await getJSON("https://api.vercel.com/v9/projects/" + encodeURIComponent(vc.project()) + vc.q(), vc.h());
    if (!proj.ok) return proj;
    const r = await getJSON("https://api.vercel.com/v10/projects/" + proj.data.id + "/promote/" + id + vc.q(), vc.h(), { method: "POST" });
    return r.ok || r.status === 201 || r.status === 202 ? { ok: true } : r;
  }
};

/* ---------- YouTube (Data API v3, OAuth refresh token) ---------- */
let ytToken = null;
const yt = {
  configured: () => !!(env("YOUTUBE_CLIENT_ID") && env("YOUTUBE_CLIENT_SECRET") && env("YOUTUBE_REFRESH_TOKEN")),
  async token() {
    if (ytToken && ytToken.until > Date.now() + 60e3) return { ok: true, token: ytToken.value };
    let r;
    try {
      r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ client_id: env("YOUTUBE_CLIENT_ID"), client_secret: env("YOUTUBE_CLIENT_SECRET"), refresh_token: env("YOUTUBE_REFRESH_TOKEN"), grant_type: "refresh_token" }) });
    } catch (e) { return { ok: false, error: "Network error: " + e.message }; }
    const j = await r.json().catch(() => ({}));
    if (!j.access_token) return { ok: false, error: "Google refused the refresh token (" + (j.error || r.status) + ")" };
    ytToken = { value: j.access_token, until: Date.now() + (j.expires_in || 3000) * 1000 };
    return { ok: true, token: j.access_token };
  },
  async channels() {
    const t = await yt.token(); if (!t.ok) return t;
    const r = await getJSON("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", { Authorization: "Bearer " + t.token });
    if (!r.ok) return r;
    return { ok: true, data: (r.data.items || []).map(c => ({ id: c.id, title: c.snippet.title, handle: c.snippet.customUrl || "" })) };
  },
  // resumable upload: create the session, then send the bytes; success only when YouTube returns a video id
  async upload(meta, file) {
    const t = await yt.token(); if (!t.ok) return t;
    const init = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status", {
      method: "POST",
      headers: { Authorization: "Bearer " + t.token, "Content-Type": "application/json; charset=UTF-8", "X-Upload-Content-Type": file.type, "X-Upload-Content-Length": String(file.buf.length) },
      body: JSON.stringify({ snippet: { title: meta.title, description: meta.description || "", categoryId: "28" }, status: { privacyStatus: meta.visibility, selfDeclaredMadeForKids: false } })
    }).catch(e => ({ ok: false, status: -1, statusText: e.message }));
    const session = init.headers && init.headers.get("location");
    if (!init.ok || !session) { const j = init.json ? await init.json().catch(() => ({})) : {}; return { ok: false, error: (j.error && j.error.message) || "YouTube did not start the upload (" + (init.status || "") + ")" }; }
    const put = await fetch(session, { method: "PUT", headers: { "Content-Type": file.type }, body: file.buf }).catch(e => ({ ok: false, status: -1, statusText: e.message }));
    const j = put.json ? await put.json().catch(() => ({})) : {};
    if (!put.ok || !j.id) return { ok: false, error: (j.error && j.error.message) || "Upload failed (" + (put.status || put.statusText) + ")" };
    return { ok: true, data: { videoId: j.id, uploadStatus: j.status && j.status.uploadStatus, privacy: j.status && j.status.privacyStatus } };
  },
  async status(videoId) {
    if (!/^[\w-]{6,20}$/.test(videoId || "")) return { ok: false, error: "bad video id" };
    const t = await yt.token(); if (!t.ok) return t;
    const r = await getJSON("https://www.googleapis.com/youtube/v3/videos?part=status,processingDetails&id=" + videoId, { Authorization: "Bearer " + t.token });
    if (!r.ok) return r;
    const v = (r.data.items || [])[0];
    if (!v) return { ok: false, error: "YouTube does not return this video" };
    return { ok: true, data: { uploadStatus: v.status.uploadStatus, privacy: v.status.privacyStatus, processing: v.processingDetails && v.processingDetails.processingStatus, failure: v.status.failureReason || v.status.rejectionReason || null } };
  }
};

module.exports = { gh, vc, yt };

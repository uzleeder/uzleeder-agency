# uzleeder.uz deployment — 2026-10-21

Netlify site: uzleeder-ai (5ae19c6e-3f91-4336-be2c-354b3e5f0cc5).
Latest verified deployment: 6ad8a29053a879eeb8f79521.
Direct URL: https://6ad8a29053a879eeb8f79521--uzleeder-ai.netlify.app

Canonical URLs and production SITE_URL now use https://uzleeder.uz.
Netlify custom domain and www alias are configured.
Eskiz nameservers saved and reread successfully:
- dns1.p06.nsone.net
- dns2.p06.nsone.net
- dns3.p06.nsone.net
- dns4.p06.nsone.net

WHOIS hide option selected on submission. Registrar editor does not display the stored radio selection on reopen.
Vercel DNS changes were rejected due to its team fair-use block; no Vercel DNS records were modified.

Verified: 343 existing automated checks; modern adapter regression check; public/locale/partner/admin/workspace pages HTTP 200; content/startups APIs HTTP 200; login HTTP 200; authenticated overview HTTP 200; unauthenticated overview HTTP 401.

Runtime fixes: restored existing local admin environment values, migrated to modern Request/Response Netlify functions to preserve strong-consistency Blobs context, explicitly packaged installed dependencies because Windows tracing omitted external CJS dependencies. Legacy adapters remain for compatibility tests.

Pending: public resolvers still returned Vercel nameservers at the last check; Netlify TLS provisioning returned `bad dns for custom domain`. Recheck delegation before retrying `node server/netlify-domain.cjs tls`, then verify apex HTTPS and www redirect. Do not claim the custom domain is live until verified.

External integrations: Telegram token currently fails the configured token format; YouTube/GitHub/deployment integrations were not verified. No real messages sent. Existing Vercel Blob data was not migrated into the separate Netlify store.

Helpers read credentials in memory only. Never print secret values or session tokens.

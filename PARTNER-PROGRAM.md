# UzLeeder Partner Program

## Routes and integration

- `/partners`: public information, review-before-submit form, conditions and privacy notice.
- `/workspace/partners`: applicant/partner access area. A 256-bit private access key and application reference are required; keys are sent in POST bodies, never URLs or analytics. The key is shown once after persistence and retained only in sessionStorage on this device. Save it securely; there is no automated email recovery.
- `/admin#/partners`: program settings, application list/filter/page, qualification review, decisions and onboarding.
- `/workspace#partners`: the same owner-authorized operational module inside the existing Workspace.
- `POST /api/contact?partner=1`: dedicated dispatch within the existing contact function, avoiding an additional Vercel function. Existing contact behavior is unchanged.

This module never invokes the startup certificate system.

## Enable only after configuration

Applications default to **closed**. In Admin → Partners → Program settings, record the verified responsible organization, privacy contact email, closed-record retention period, and onboarding checklist. Review the conditions/privacy text for the actual relationship and jurisdiction, then acknowledge that review before enabling applications. No legal entity or contact has been fabricated or pre-populated.

Required runtime: existing `ADMIN_SECRET`, owner credentials and `BLOB_READ_WRITE_TOKEN` connected to a **private** store. A public Blob store fails closed for partner records. Optional existing `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` notify the authorized owner with only the reference, after persistence. Acceptance/failure is stored. Applicant notifications are the private portal messages; no email delivery is claimed. No messages are sent merely by changing an internal note.

## Data model and migration

No SQL database exists in this repository, so no disconnected SQL store or fictional migration was introduced. Additive private Blob paths are created on first use:

- `partners/config.json`, `partners/config-history/*`: program configuration and its audit history.
- `partners/records/<reference>/<revision>.json`: immutable snapshots of application, versioned notice text/acceptance, evidence metadata, private review, applicant messages, qualification tasks/submissions/results, decisions, partner profile, assignments, onboarding and audit events.
- `partners/records/<reference>/files/<id>`: private uploaded evidence (PDF/PNG/JPEG/TXT, signature/type validation, 1 MB, 12 per application). Downloads require the same record authorization. Files are downloaded rather than rendered as active web content.
- `partners/rate/*`: hashed hourly submission buckets, no raw IP addresses.
- `partners/deleted/<hash>.json`: anonymous deletion tombstones that prevent a stale writer from restoring an erased record.
- `partners/maintenance/*`: anonymous deletion counts and maintenance events.

Immutable revision writes use `allowOverwrite:false`; concurrent changes to the same revision fail rather than overwrite. This follows the repository's Blob adapter and [Vercel's overwrite protection](https://vercel.com/docs/vercel-blob). Existing records and authentication are not migrated. Notice text is copied at acknowledgement so future edits do not rewrite previously accepted conditions.

## Workflow

Submitted → Under Review / More Information Required → Qualification / Trial Collaboration → Approved or Declined; Withdrawn and Closed are also supported. Reopening requires an owner stage change with a reason. All stage reasons are explicitly labelled applicant-visible. Private notes and qualitative assessments are not exposed to applicants.

Approval requires a qualification/trial stage, all qualitative review criteria, an approved role and resolved tasks. It creates the profile and incomplete onboarding checklist, with **zero projects assigned**. Trial terms must include scope, deliverables, existing IP, permitted use, IP/licensing, compensation, confidentiality, acceptance and termination. Applicant acceptance is required before evidence submission. Production assignments use separately approved project agreements rather than disguised trials.

## Access model

The existing system remains owner-operated, as previously requested. Only the existing `admin` session may configure, review or decide. Other existing roles are denied; a reviewer name records responsibility but does not create an account or grant permission. Multi-reviewer identity provisioning was not invented.

Applicants authenticate only to their own record with an unguessable key; its hash is stored server-side. They cannot list applications or call company Workspace APIs. Approved partners receive only explicitly assigned project **name/status summaries**. No customer notes, repositories, production credentials, finances or administrative access are granted. This version does not grant document editing or company task access. Suspension or ending immediately blocks project reads. More expansive collaboration access must be implemented with field-level policies before granting it.

## Retention and privacy operations

Owner can process privacy requests, set a reasoned hold with an expiry (maximum one year), or erase a record using its exact reference. Erasure includes private files and every audit snapshot; anonymous tombstones/maintenance records remain. Run **retention cleanup** periodically from Partners; it deletes closed/ended applications beyond the configured period unless an active hold applies, and removes expired rate buckets. No background cron was silently created. Open/active records require periodic owner review. The owner must operationally schedule cleanup before enabling intake; the maintenance button is not an automatic retention scheduler.

## Verification and limits

- `npm run build:site`: existing site build and locale checks.
- `npm test`: existing suites plus `server/test-partners.cjs` (isolated storage, no real messages).
- `server/test-partner-browser.cjs`: Playwright + headless Edge; uses in-memory storage and local test credentials. `PLAYWRIGHT_MODULE` can point to the installed Playwright package. Checks application submission, portal response, Admin review, Workspace mount, 360/390/768/1024/1280/1440 widths, light theme, reduced motion, keyboard focus and JavaScript errors.

New program copy is English; existing five-language pages/content are preserved. New nav link currently uses “Partners” across locales. Full translations, screen-reader assessment and a legal review remain separate work. No guarantee of accessibility conformance is claimed.

Lists use filtered/sorted pagination (25 per page) over a bounded Blob scan (10,000 paths), suitable for small owner-managed intake. Before scaling, add a transactional indexed database and scheduled retention jobs. Upload validation is not malware scanning; reviewers should handle all evidence as untrusted. Automated applicant email, account recovery, multi-reviewer provisioning and broader document/task access are not configured features.

## Changed source files

Backend: `api/_lib/partners.js`, `api/_lib/partner-notices.json`, `api/contact.js`.
UI: `partners.html`, `partners.js`, `partner-ui.js`, `partner.css`, `partner-workspace.html`, `partner-workspace.js`, `admin.html`, `workspace.html`, `index.html`.
Routing/build: `vercel.json`, `server/local-dev.cjs`, `build/build-locales.js`, `package.json`; generated locale HTML, `script.js`, sitemap and robots follow the existing build.
Tests: `server/test-partners.cjs`, `server/test-partner-browser.cjs`.

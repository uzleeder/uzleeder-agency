# UZLEEDER — Partner Program Policy

- **Version:** 1.0 — Draft for review
- **Program:** UzLeeder Partner Qualification Program
- **Policy owner:** UzLeeder
- **Effective date:** draft — set when the policy is approved
- **Official contact:** uzleeder@gmail.com
- **Website:** https://uzleeder.uz

Parts I (public partner page) and II (official policy) are published at **https://uzleeder.uz/partners/policy** (`partner-policy.html`). The application form records acknowledgement of version `1.0` (`api/_lib/partner-notices.json`). This file keeps Part III, the internal workflow and system requirements — it is not published (`*.md` is excluded from `dist/`).

## PART III — PARTNER PROGRAM WORKFLOW AND SYSTEM REQUIREMENTS

### 25. Required Program Statuses
The application and qualification system should support these statuses:

1. Submitted — Application received and stored.
2. Under Review — Initial eligibility and application review.
3. More Information Required — Applicant must provide clarification.
4. Policy Acknowledgment Required — Applicable terms have not yet been acknowledged.
5. Qualified for Assessment — Applicant is approved to enter the qualification stage.
6. Pathway Selection — The assessment pathway is being selected or confirmed.
7. Project Brief Issued — An assigned project brief or independent project requirements have been provided.
8. In Progress — Qualification work is underway.
9. Submission Received — Applicant has submitted the deliverables.
10. Under Evaluation — Review is in progress.
11. Revision Requested — Specific improvements or clarifications are requested.
12. Additional Assessment — Another assessment is required.
13. Qualified — The applicant has met the stated qualification criteria.
14. Partnership Decision Pending — The partnership proposal is awaiting authorization.
15. Approved — Agreement Pending — Approval is granted subject to agreement completion.
16. Onboarding — Agreement requirements are complete and onboarding is underway.
17. Active Partner — The partnership is established and active under the applicable agreement.
18. Not Qualified — The qualification requirements were not met.
19. Declined — The application or partnership proposal was declined.
20. Withdrawn — The applicant withdrew.
21. Suspended — Participation or an established relationship has been temporarily restricted under applicable terms.
22. Closed — The application or process has ended.

Statuses should change only through authorized actions and valid workflow transitions. The system must not automatically label an applicant an active partner merely because a project was submitted or passed.

### 26. Public Website Requirements
The public Partner Page should include:

- Program introduction and value proposition.
- Eligible applicant types and collaboration areas.
- Explanation of both qualification pathways.
- The complete qualification process.
- A summary of expectations and evaluation criteria.
- Compensation and intellectual-property transparency principles.
- Link to the full Partner Program Policy.
- Link to the Privacy Notice.
- Accessible application form.
- Confirmation that applying does not guarantee approval.
- Clear contact details and current policy version.

The application form should collect only relevant information and should support an accessible, secure submission flow.
A successful submission message must appear only after the application has actually been saved.

### 27. Applicant Portal Requirements
The private applicant portal should provide:

- Application reference and current status.
- Policy version and acknowledgment record.
- Messages and requests from authorized reviewers.
- Selected qualification pathway.
- Project brief and acceptance criteria.
- Deadline and milestone information.
- Submission form and permitted attachments.
- Submission confirmation and timestamps.
- Review outcome and available feedback.
- Agreement and onboarding steps where applicable.
- Withdrawal or support request options.

Applicants must not see internal reviewer notes, other applicants' information, private business discussions, or confidential information beyond their authorization.

### 28. Admin Panel Requirements
The Admin Panel should provide an authorized Partner Management section with:

- Application search and filtering.
- Application and applicant profile views.
- Review assignment and internal notes.
- Policy acknowledgment records.
- Pathway selection and project assignment.
- Project brief templates.
- Evaluation rubric and score or evidence records.
- Submission review and feedback.
- Requests for revisions or additional information.
- Partnership approval and decision recording.
- Agreement and onboarding tracking.
- Status history and audit logs.
- Data export and deletion tools where authorized and appropriate.
- Role-based access controls.

Internal notes must remain private. Reviewers must be able to distinguish facts, evidence, opinions, and final decisions.

### 29. Workspace Requirements
The private UzLeeder Workspace should provide the operational tools needed to run the program:

- Partner application queue.
- Qualification project board.
- Project briefs and deliverables.
- Tasks, milestones, and deadlines.
- Approved repository and development links.
- Submission and feedback history.
- Team assignments and reviewer responsibilities.
- Partnership decision records.
- Agreement and onboarding checklist.
- Active partner directory.
- Access provisioning and revocation tracking.
- Activity history and notifications.

The Workspace and Admin Panel must use the same authoritative application and partnership records rather than maintaining conflicting copies.
Only authorized users may access private records, assign projects, change decisions, or grant access.

### 30. Roles and Permissions
The system should support role-based permissions for:

- **Applicant:** Manage their own application, view assigned work, submit deliverables, and receive feedback.
- **Reviewer:** Review assigned applications and submissions, record evidence, and provide recommendations.
- **Partner Program Manager:** Coordinate the program, assign qualification pathways, manage reviews, and prepare decisions.
- **Administrator:** Manage authorized program configuration, user access, and system-level operations.
- **Active Partner:** Access only the resources and projects authorized by the applicable agreement and role.

A reviewer recommendation must not automatically grant active partner status unless the configured authorization rules explicitly permit the required decision and all agreement conditions have been satisfied.
Sensitive actions must be recorded in an audit trail.

### 31. Data and Operational Integrity
The system must use persistent storage and server-side authorization.
It must not rely on frontend-only role checks, fabricated applications, simulated approval states, or success messages that appear before operations complete.

Important events should be recorded, including:

- Application creation and changes.
- Policy acknowledgment.
- Pathway and project assignment.
- Submission and revision.
- Review and decision.
- Agreement status.
- Onboarding completion.
- Access grants and revocations.
- Suspension, withdrawal, and closure.

Notifications should be sent only through configured services. A notification must not be marked as delivered unless the delivery service confirms the relevant result.
The system must support error handling, secure file uploads, input validation, reasonable rate limits, and appropriate protection of personal information.

### 32. Launch Checklist
Before the program opens to the public, UzLeeder should:

- Confirm the responsible legal or operating entity.
- Review the policy and agreements for the applicable jurisdiction.
- Publish an accurate Privacy Notice.
- Establish official program and privacy contacts.
- Define evaluation rubrics for the first available roles.
- Prepare assigned-project and independent-project templates.
- Define assessment compensation and IP terms.
- Establish reviewer permissions and decision authority.
- Configure persistent storage, audit logs, and access controls.
- Test the full application-to-onboarding workflow.
- Test rejection, withdrawal, revision, and suspension paths.
- Verify that applicants cannot access other applicants' information.
- Ensure the public page describes actual program operations.

## FINAL PROGRAM PRINCIPLE
UzLeeder welcomes potential, evaluates demonstrated ability, protects the rights of contributors, and establishes partnerships through explicit agreement.

The program is designed to identify people who can contribute meaningfully, build reliable products, collaborate responsibly, and grow alongside UzLeeder.

A submitted application is a request to participate. A qualification project is an opportunity to demonstrate ability. An evaluation is a documented assessment. Approval is a decision. A partnership is a defined relationship established through the applicable agreement.

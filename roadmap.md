# Roadmap

## Open tasks

- [ ] **Razul machine-identity connection (blocked: external project)** — Razul's agents get individually authorized, scoped, revocable machine access into this project, coordinated with the separate Razul setup project `733f4559-7c74-4a46-8bea-3cbbde871040`. No fake human Razul login, no shared passwords. Do not claim any connection until actually verified end-to-end. Waiting on: the Razul project being provisioned and an explicit connection request from the owner.
- [ ] **Dormant QA workspace code (blocked: owner decision)** — `src/lib/qa.ts`, `src/lib/qa.functions.ts`, `/qa` and `/qa-invite/$token` routes plus the `qa_invitations` / `qa_access` / `qa_issues` database tables exist but are unlinked from navigation (embedded-reviewer direction was stopped by owner). Reuse or remove only on explicit owner instruction; table removal needs owner approval.

## Done

- Owner/private login and account area — intact, untouched by Razul changes.
- Branding "Itanimulli: The Rise of Kings" — applied and verified.

# DEC Administrator Onboarding Readiness Report

Date: 24 July 2026

## Decision

**Blocked on external DNS administration.** Repository-side email delivery and administrator rehearsal preparation may continue, but administrator accounts and onboarding emails must not be created or sent until the transactional sender domain is verified and live delivery passes.

## DNS and sender status

- Transactional domain: `mail.decethiopia.org`
- DKIM record: not published at the latest check
- Return-path MX and SPF records: not published at the latest check
- Resend domain status: pending
- Existing DMARC: `p=none; sp=none`
- DMARC decision: no change is required to conduct the limited internal rehearsal. It is monitoring-only; DEC should review aggregate results before a later move to enforcement.

The DEC hosting administrator must publish the three Resend records already supplied for:

- `resend._domainkey.mail.decethiopia.org` (TXT)
- `send.mail.decethiopia.org` (MX, priority 10)
- `send.mail.decethiopia.org` (TXT SPF)

No unrelated root-domain mail records should be replaced.

## Prepared application behavior

- Supabase confirmation and recovery template guidance is documented.
- Hub staff and learner invitations use the same SMTP service.
- Staff onboarding contains the private portal, personal password setup, administrator guide, internal checklist, boundaries, and support direction.
- Course invitation delivery is recorded as sent only after provider acceptance.
- Provider failure is recorded safely and does not claim delivery.
- Full activation URLs, recipients, credentials, and provider responses are excluded from application logs.
- The administrator rehearsal guide is role-protected and not present in public navigation.

## Approved but not yet provisioned

The five approved Platform Administrator testers are listed in `dec-internal-platform-rehearsal-package.md`. No account or email may be created from this approval until the DNS and delivery gates pass.

## Repository verification

The prepared implementation passed:

- Prisma generation;
- `npx prisma validate`;
- `npm run prisma:validate`;
- TypeScript typecheck;
- lint;
- production build;
- pilot email delivery and redaction verifier;
- P2D onboarding and access verifier;
- role-boundary verifier;
- open-registration verifier;
- Stage A session verifier;
- authentication-recovery verifier;
- `git diff --check`.

The production build emitted the existing fallback-course-data warning because no live database was supplied to the local build. It completed successfully. No Prisma schema or migration changed. Generated `next-env.d.ts` churn was reverted.

`.env.local` and `.vercel/*` remain ignored. No environment file, SMTP credential, recipient-specific activation URL, generated Prisma client, or local build output is included in the prepared change.

## Configuration gate

After DNS verification:

1. create a sending-only Resend credential restricted to `mail.decethiopia.org`;
2. set the approved sender, reply-to, and support identity;
3. configure Supabase custom SMTP;
4. configure the Hub Preview SMTP variables;
5. set Supabase Site URL and exact redirect allowlist to the controlled Preview;
6. test confirmation, recovery, staff invitation, and learner invitation using synthetic addresses;
7. inspect application, Vercel, Supabase, and provider logs for token and URL redaction;
8. only then provision and email the five administrators individually.

Preview-only and staging-only configuration must be used. Production environment variables, aliases, deployments, and data remain out of scope.

## Administrator duration

`23 August 2026` is treated as the end of the internal testing period only. It is not an account-deactivation instruction. DEC must decide after the rehearsal which named administrators continue managing the real pilot.

## Remaining owner actions

1. DEC or its hosting administrator must add the supplied DNS records.
2. DEC must confirm the monitored reply-to/support mailbox. The proposed address is `ephremt@decethiopia.org`.
3. DEC must provide the approved issue-log destination, or authorize use of the template in the rehearsal package.

# S10A Controlled Reviewer Access Setup Report

Date: 2026-07-07  
Branch: `feature/supabase-auth-vercel-real-pilot`  
Hub production URL: `https://cdp-lg-andy-g-pilot-xziq.vercel.app`  
HRBA production URL: `https://pilot-hrba-e-learn-v1-wajj.vercel.app`

## Summary

Reviewer access is configured through the existing strict pilot registration model:

- Access model used: strict invited emails plus the existing shared pilot access code.
- Reviewer emails provided: 19.
- Reviewer emails added to the intended production invite value: 19.
- Existing known pilot learner retained: `agiledatawise@gmail.com`.
- Existing local invite baseline also retained: `essetlab@gmail.com`.
- Registration remains strict: yes, `PILOT_REGISTRATION_MODE` was updated to `strict` in Vercel production.
- Public/open registration enabled: no.
- Pilot access code changed or printed: no.
- Reviewer accounts manually created: no.
- Mulu registration performed: no.
- Migrations/seeds run: no.
- HRBA deployment performed: no.
- Certificate logic changed: no.

## Initial Repo State

- Current branch: `feature/supabase-auth-vercel-real-pilot`.
- Initial git status: clean.
- Recent S9B certificate demo report commit in history: yes, `12b462c Add focused Daniel certificate demo report`.

## Registration Configuration Inspection

Code inspected: `src/lib/pilot-registration-workflow.ts`.

- `PILOT_REGISTRATION_MODE=strict` is supported.
- `PILOT_INVITED_EMAILS` is supported.
- Comma-separated invited emails are supported.
- `PILOT_ACCESS_CODES` and `PILOT_ACCESS_CODE` are supported.
- The access code check runs before account/profile creation.
- Strict invited-email validation runs before account/profile creation.
- Existing onboarding invitations can also allow a participant email when strict mode is active.
- No code change was required.

Production Vercel env listing confirmed these variable names exist for the Hub project:

- `PILOT_ACCESS_CODE`
- `PILOT_REGISTRATION_MODE`
- `PILOT_INVITED_EMAILS`

Important limitation: Vercel CLI showed the production env values as encrypted and did not expose their values through `vercel env pull` or `vercel env run` when local env files were removed. Because of that, exact production invited-email readback before/after could not be independently printed from Vercel. The update commands succeeded and the Hub was redeployed afterward.

Local controlled baseline before update:

- Registration mode: strict.
- Access code configured: yes.
- Invited email count before update: 2.
- Daniel retained before update: yes.
- Existing emails intentionally removed: no.

Production invite value applied:

- Invited email count after update: 21.
- Daniel retained after update: yes.
- Existing local invite retained after update: yes.
- Existing emails intentionally removed: no.

## Normalized Reviewer Emails Added

All 19 reviewer emails were normalized to lowercase, trimmed, and validated.

- Valid email format for all 19: yes.
- Duplicate reviewer emails: no.
- New reviewer email count: 19.

Normalized reviewer emails:

```txt
mekdest@decethiopia.org
dirshaye.solomon@welthungerhilfe.de
gizachew.leulseged@welthungerhilfe.de
ewnetu.mekonnen@welthungerhilfe.de
emnet.solomon@welthungerhilfe.de
fetene.gebeyehu@welthungerhilfe.de
liyu.cosap121@gmail.com
tsegaye.cosap@gmail.com
derejet@decethiopia.org
berukt@decethiopia.org
yenusa@decethiopia.org
ephremt@decethiopia.org
hiwotw@decethiopia.org
mesfin.degaga@welthungerhilfe.de
berhanud@decethiopia.org
lalekidist@gmail.com
yosef.cosap@gmail.com
andualemworku1@gmail.com
tbeyene972@gmail.com
```

## Production Env Update

Mechanism used: Vercel production environment variables for project `cdp-lg-andy-g-pilot-xziq`.

Commands run:

```powershell
npx vercel env update PILOT_REGISTRATION_MODE production --value strict --yes
npx vercel env update PILOT_INVITED_EMAILS production --value [21 comma-separated invited emails] --yes
```

The pilot access code variable was not updated, removed, printed, or replaced.

## Hub Production Redeploy

Hub redeployed: yes.

Final deployment:

- Deployment ID: `dpl_7LemS9Jcb1LEwtEVjxkgua6RSLkv`
- Deployment URL: `https://cdp-lg-andy-g-pilot-xziq-7bti2lhqv-girumteenexus-8292s-projects.vercel.app`
- Production alias: `https://cdp-lg-andy-g-pilot-xziq.vercel.app`
- Deployed commit: `12b462c8dcaa58c2fb31aff0a690571fb3965226`
- Ready status: yes.

Note: an initial deployment was run after the env update, then a second clean deployment was run with local env files temporarily moved aside so the deployment used Vercel production env handling and did not detect the local `.env` file.

HRBA redeployed: no.

## Route Smoke Results

Production routes checked after the final clean redeploy:

| Route | HTTP status | Result |
|---|---:|---|
| `/` | 200 | loads |
| `/register` | 200 | loads |
| `/sign-in` | 200 | loads |
| `/courses` | 200 | loads |
| `/verify-certificate` | 200 | loads |
| unauthenticated `/learn` | 307 | redirects to `/sign-in?next=%2Flearn` |

- `/register` loads: yes.
- `/sign-in` loads: yes.
- `/courses` loads: yes.
- `/verify-certificate` loads: yes.
- Unauthenticated `/learn` redirects to sign-in: yes.
- Server error marker found: no.

## Registration Control Check

No real reviewer registration was submitted.

- Registration page form display loads: yes.
- Strict registration mode appears active: yes by code inspection and production env update command.
- Non-invited email rejection exists: yes by code inspection; strict mode returns `email-not-invited` before account/profile creation.
- Invited email validation path exists: yes by code inspection; `PILOT_INVITED_EMAILS` is normalized and checked before account/profile creation.
- Safe non-mutating form submission: not performed, because the registration action creates accounts after successful validation and the task forbids creating accounts.

## Daniel Safety Check

Requested read-only Prisma safety checks were attempted, but could not be completed against production from the local workspace:

- Local Prisma query using the default local `.env` failed with `ECONNREFUSED`, because the local database endpoint was not running/reachable.
- Vercel production env values, including `DATABASE_URL`, were listed as encrypted and were not exposed through `vercel env pull` or `vercel env run` for local Prisma use.
- No raw IDs were printed.
- No database writes were attempted.

Therefore these production DB facts remain unverified in this report:

- Daniel exists.
- Daniel quiz attempt count.
- Daniel certificate count.
- Duplicate Daniel certificates.
- Mulu exists.
- ANGAFA exists.
- Total users count.
- Total certificates count.

Known from this S10A work:

- Daniel's email was retained in the invited-email value applied to production.
- No reviewer accounts were manually created.
- No Mulu registration was performed.

## Checks Run

```powershell
git branch --show-current
git status --short
git log --oneline -25
rg -n "PILOT_REGISTRATION_MODE|PILOT_INVITED_EMAILS|PILOT_ACCESS_CODE|PILOT_ACCESS_CODES|invited" -S .
npx vercel project ls
npx vercel link --yes --project cdp-lg-andy-g-pilot-xziq
npx vercel env ls production
npx vercel env pull .env.s10a.local --environment=production --yes
npx vercel env update PILOT_REGISTRATION_MODE production --value strict --yes
npx vercel env update PILOT_INVITED_EMAILS production --value [redacted email CSV] --yes
npx vercel deploy --prod --yes
npx vercel deploy --prod --yes
npm run build
npm run lint
npx prisma validate
npm run prisma:validate
git diff --check
git status --short
```

Check results:

- `npm run build`: passed. Local build logged a fallback warning because local DB was unreachable during public course generation.
- `npm run lint`: passed.
- `npx prisma validate`: passed.
- `npm run prisma:validate`: passed.
- `git diff --check`: passed.

## Remaining Warnings

- Vercel CLI did not expose encrypted production env values for independent readback, so the exact production invited list could not be printed after update.
- The production DB read-only Daniel/Mulu/ANGAFA safety counts could not be completed from this workspace because production `DATABASE_URL` could not be retrieved and the local DB endpoint was unreachable.
- Local `.env` was not changed. Future manual local Vercel deploys should avoid uploading local `.env` or should temporarily move it aside as done in the final clean S10A deploy.

## Owner Reviewer Invite Message

Subject: CSO Learning Hub HRBA pilot reviewer access

Dear reviewer,

You are invited to review the CSO Learning Hub HRBA pilot learning flow.

Please use the Hub registration page:

`https://cdp-lg-andy-g-pilot-xziq.vercel.app/register`

Register with your own email address and a password you choose. When asked for the pilot access code, enter:

`[INSERT PILOT ACCESS CODE]`

After registration, sign in at:

`https://cdp-lg-andy-g-pilot-xziq.vercel.app/sign-in`

Then open the HRBA course from the Hub and test the learning flow. You may complete the final assessment if you wish. If you pass, the Hub should issue your certificate automatically.

Please do not share the pilot access code outside the approved reviewer group. If registration or sign-in is blocked, please send the programme owner a screenshot and your browser name/version.

## Recommendation

- Owner sends the invite email with the pilot access code inserted.
- Monitor the first 2-3 reviewer registrations.
- Ask reviewers to report a screenshot and browser if blocked.

## Scope-Control Confirmation

- No reviewer accounts were manually created.
- No shared reviewer account was created.
- No passwords were created for reviewers.
- No Google/Gmail OAuth was added.
- Public registration was not opened.
- No migrations were run.
- No seed scripts were run.
- Supabase schema was not changed.
- HRBA course code was not changed.
- HRBA was not deployed.
- Certificate logic was not changed.
- Secrets, passwords, raw tokens, token hashes, raw database IDs, and the pilot access code were not printed.

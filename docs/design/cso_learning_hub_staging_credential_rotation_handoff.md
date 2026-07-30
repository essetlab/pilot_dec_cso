# Staging Database Credential Rotation Handoff Note

**To**: Authorized Infrastructure Administrator / Supabase Project Administrator
**Date**: July 31, 2026

---

## 1. Context of Requested Action
During the initial intake diagnostics and visual verification checks for the CSO Learning Hub revamp, the database connection password for the staging database was displayed in the console task logs of the development agent environment. Although these logs remain local to the App Data brain workspace and were never committed to Git, the connection string containing the credential is considered compromised and **requires immediate rotation**.

* **Staging Project ID**: `fgyxbzwdvngqlksyxuwa`
* **Staging Host**: `aws-0-eu-west-1.pooler.supabase.com:6543` (transaction pooler)

---

## 2. Credentials Requiring Rotation
* PostgreSQL Database Password for the default `postgres` user on project reference `fgyxbzwdvngqlksyxuwa`.
* **Important**: Do NOT rotate the active pilot database credentials (`bhzyrthinbyqgsetnoph`), as it remains isolated and was never exposed or modified.

---

## 3. Required Updates Post-Rotation
Once the password has been rotated in the Supabase management console, please update:
1. **GitHub Secrets / Vercel Environment Variables**: Ensure `DATABASE_URL` and `DIRECT_URL` for the Staging/Preview branch tracks are updated to reflect the new password.
2. **Offline Secrets Manifests**: Update `d:\CSO_Learning_Hub_Secrets\phase1-staging.env` to synchronize the new values.
3. **DO NOT** commit the updated connection strings, passwords, or files containing them to the Git repository.

---

## 4. Post-Rotation Verification Checks
After the credentials have been updated, please execute the following read-only tests to verify connection sanity:
```bash
npm run build
npm run verify:s6-route-roles
npm run verify:r22d
```
All of the above commands must pass without connectivity or authentication failures.

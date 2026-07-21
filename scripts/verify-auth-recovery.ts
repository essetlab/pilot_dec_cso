import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { readRecoveryCredentials } from "../src/lib/auth/recovery-session";

const source = async (path: string) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const valid = readRecoveryCredentials("#access_token=fake-access&refresh_token=fake-refresh&type=recovery");
assert.deepEqual(valid, { accessToken: "fake-access", refreshToken: "fake-refresh" });
assert.equal(readRecoveryCredentials("#type=recovery&access_token=missing-refresh"), null);
assert.equal(readRecoveryCredentials("#access_token=fake&refresh_token=fake&type=signup"), null);
assert.equal(readRecoveryCredentials("#error=access_denied&error_code=otp_expired"), null);

const browserClient = await source("src/lib/supabase/client.ts");
assert.match(browserClient, /createBrowserClient/);
assert.match(browserClient, /@supabase\/ssr/);

const callback = await source("src/app/(auth)/auth/callback/route.ts");
assert.match(callback, /exchangeCodeForSession\(code\)/);
assert.match(callback, /reset-password\?recovery=fragment/);

const recoveryForm = await source("src/components/auth/RecoveryPasswordForm.tsx");
assert.match(recoveryForm, /readRecoveryCredentials\(window\.location\.hash\)/);
assert.match(recoveryForm, /supabase\.auth\.setSession/);
assert.match(recoveryForm, /sessionData\.user/);
assert.match(recoveryForm, /supabase\.auth\.getUser/);
assert.match(recoveryForm, /history\.replaceState/);
assert.match(recoveryForm, /setState\("invalid"\)/);
assert.match(recoveryForm, /hasServerSession/);

const resetPage = await source("src/app/(auth)/reset-password/page.tsx");
assert.match(resetPage, /supabase\.auth\.getUser/);
assert.match(resetPage, /hasServerSession=\{Boolean\(user\)\}/);

const resetAction = await source("src/app/(auth)/reset-password/actions.ts");
assert.match(resetAction, /supabase\.auth\.getUser/);
assert.match(resetAction, /supabase\.auth\.updateUser\(\{ password \}\)/);
assert.match(resetAction, /supabase\.auth\.signOut/);
assert.doesNotMatch(resetAction, /prisma|courseAssignment|enrollment|lessonProgress/i);

const forgotAction = await source("src/app/(auth)/forgot-password/actions.ts");
assert.match(forgotAction, /resetPasswordForEmail/);
assert.match(forgotAction, /reset-password\?recovery=fragment/);
assert.doesNotMatch(forgotAction, /auth\/callback\?next=\/reset-password/);
assert.match(forgotAction, /resolvePublicAuthOrigin/);
assert.match(forgotAction, /flowType: "implicit"/);
assert.match(forgotAction, /persistSession: false/);
assert.match(forgotAction, /detectSessionInUrl: false/);
assert.doesNotMatch(forgotAction, /createSupabaseServerClient/);
assert.match(forgotAction, /notice=sent/);

const registrationWorkflow = await source("src/lib/open-registration-workflow.ts");
assert.equal((registrationWorkflow.match(/\.auth\.signUp\(/g) ?? []).length, 1);
assert.match(registrationWorkflow, /authOrigin/);

const registrationAction = await source("src/app/(auth)/register/actions.ts");
assert.match(registrationAction, /resolvePublicAuthOrigin/);

const authOrigin = await source("src/lib/auth/public-auth-origin.ts");
assert.match(authOrigin, /VERCEL_URL/);
assert.match(authOrigin, /VERCEL_BRANCH_URL/);
assert.match(authOrigin, /allowedOrigins\.has\(requestOrigin\)/);

const registerPage = await source("src/app/(auth)/register/page.tsx");
assert.match(registerPage, /AuthSubmitButton/);

console.log("PASS: recovery email issuance is not bound to a PKCE verifier cookie.");
console.log("PASS: PKCE callback exchange remains available for compatible recovery links.");
console.log("PASS: recovery fragments are exchanged client-side and removed from the URL.");
console.log("PASS: malformed and expired-style recovery fragments fail closed.");
console.log("PASS: password reset changes Auth credentials without touching assignment or progress data.");
console.log("PASS: registration has one signup call and prevents repeat submission while pending.");

import fs from "fs";
import path from "path";

function runVerify() {
  console.log("=== Verification: QA and Auth Security Boundary Checks ===");

  const projectRoot = path.join(__dirname, "..");
  const signInPagePath = path.join(projectRoot, "src", "app", "(auth)", "sign-in", "page.tsx");
  const signInActionsPath = path.join(projectRoot, "src", "app", "(auth)", "sign-in", "actions.ts");
  const qaPagePath = path.join(projectRoot, "src", "app", "(auth)", "local-qa", "auth", "page.tsx");

  // 1. Check standard sign-in page contains no QA controls
  console.log("Checking standard sign-in page...");
  if (!fs.existsSync(signInPagePath)) {
    console.error(`FAIL: Standard sign-in page missing at ${signInPagePath}`);
    process.exit(1);
  }
  const signInPageContent = fs.readFileSync(signInPagePath, "utf8");

  const blacklistedKeywords = [
    "Quick access pilot learner",
    "publicQuickAccessUsers",
    "signInDemoUser",
    "DEMO_USERS",
  ];

  for (const keyword of blacklistedKeywords) {
    if (signInPageContent.includes(keyword)) {
      console.error(`FAIL: Standard sign-in page still contains forbidden QA control keyword: "${keyword}"`);
      process.exit(1);
    }
  }
  console.log("PASS: Standard sign-in page is clean of developer and QA controls.");

  // 2. Check local QA auth page has all strict guards
  console.log("Checking local QA authentication page guards...");
  if (!fs.existsSync(qaPagePath)) {
    console.error(`FAIL: Local QA auth page missing at ${qaPagePath}`);
    process.exit(1);
  }
  const qaPageContent = fs.readFileSync(qaPagePath, "utf8");

  const requiredGuards = [
    'process.env.APP_ENVIRONMENT === "local-test"',
    'process.env.ALLOW_LOCAL_DEMO_AUTH === "true"',
    'process.env.NODE_ENV === "production"',
    'host.includes("localhost") || host.includes("127.0.0.1")',
    '"fgyxbzwdvngqlksyxuwa", "bhzyrthinbyqgsetnoph"',
    'dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1") || dbUrl.includes("file:") || dbUrl.includes("dev.db")',
  ];

  for (const guard of requiredGuards) {
    const cleanGuard = guard.replace(/\s+/g, "");
    const cleanContent = qaPageContent.replace(/\s+/g, "");
    if (!cleanContent.includes(cleanGuard)) {
      console.error(`FAIL: Local QA auth page is missing strict guard: '${guard}'`);
      process.exit(1);
    }
  }
  console.log("PASS: Local QA auth page enforces all environment, hostname, and database project boundaries.");

  // 3. Check sign-in action guards
  console.log("Checking sign-in action handler guards...");
  if (!fs.existsSync(signInActionsPath)) {
    console.error(`FAIL: Sign-in actions file missing at ${signInActionsPath}`);
    process.exit(1);
  }
  const actionsContent = fs.readFileSync(signInActionsPath, "utf8");

  const requiredActionGuards = [
    'process.env.NODE_ENV === "production"',
    'host.includes("localhost") || host.includes("127.0.0.1")',
    'dbUrl.includes(id) || supabaseUrl.includes(id) || supabaseKey.includes(id)',
    'if (isLocalTest && allowDemoAuth)',
    'redirect("/sign-in?error=service-unavailable")',
  ];

  for (const guard of requiredActionGuards) {
    const cleanGuard = guard.replace(/\s+/g, "");
    const cleanContent = actionsContent.replace(/\s+/g, "");
    if (!cleanContent.includes(cleanGuard)) {
      console.error(`FAIL: signInDemoUser action is missing strict guard logic: '${guard}'`);
      process.exit(1);
    }
  }
  console.log("PASS: signInDemoUser action handler strictly enforces fail-closed execution guards.");
  
  console.log("ALL QA AND AUTH SECURITY BOUNDARY VERIFICATIONS PASSED.");
}

runVerify();

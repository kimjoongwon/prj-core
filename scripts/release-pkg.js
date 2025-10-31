#!/usr/bin/env node
const { execSync } = require("child_process");

const [, , packageName, versionType = "patch", ...flags] = process.argv;

if (!packageName) {
  console.error("❌ 패키지명을 입력해주세요.");
  console.log(
    "사용법: pnpm release:pkg @cocrepo/api-client [patch|minor|major] [--dry-run]"
  );
  process.exit(1);
}

const dryRun = flags.includes("--dry-run");

console.log(
  `\n🚀 ${packageName} 릴리즈 시작 (${versionType})${dryRun ? " [DRY RUN]" : ""}\n`
);
console.log("=".repeat(60));

try {
  // 1. 버전 업데이트
  console.log("\n1️⃣  버전 업데이트");
  console.log("-".repeat(60));
  execSync(`node scripts/version-pkg.js ${packageName} ${versionType}`, {
    stdio: "inherit",
  });

  // 2. 빌드
  console.log("\n2️⃣  빌드");
  console.log("-".repeat(60));
  execSync(`pnpm build:pkg ${packageName}`, { stdio: "inherit" });

  // 2.5 번들 사이즈 분석
  console.log("\n📊 번들 사이즈 분석");
  console.log("-".repeat(60));
  execSync(`node scripts/analyze-bundle-size.js ${packageName}`, {
    stdio: "inherit",
  });

  // 3. 배포
  console.log("\n3️⃣  배포");
  console.log("-".repeat(60));
  const publishCmd = dryRun
    ? `pnpm --filter ${packageName} publish --access public --no-git-checks --dry-run`
    : `pnpm --filter ${packageName} publish --access public --no-git-checks`;
  execSync(publishCmd, { stdio: "inherit" });

  // 4. apps 의존성 업데이트 (dry-run이 아닐 때만)
  if (!dryRun) {
    console.log("\n4️⃣  Apps 의존성 업데이트");
    console.log("-".repeat(60));
    execSync("node scripts/update-app-deps.js", { stdio: "inherit" });
  } else {
    console.log("\n⏭️  Apps 의존성 업데이트 건너뛰기 (DRY RUN)");
  }

  console.log("\n" + "=".repeat(60));
  console.log(`✅ ${packageName} 릴리즈 완료!${dryRun ? " (DRY RUN)" : ""}`);
  console.log("=".repeat(60) + "\n");

  if (dryRun) {
    console.log("💡 실제 배포를 하려면 --dry-run 플래그를 제거하세요.\n");
  }
} catch (error) {
  console.log("\n" + "=".repeat(60));
  console.error(`❌ 릴리즈 실패: ${error.message}`);
  console.log("=".repeat(60) + "\n");
  process.exit(1);
}

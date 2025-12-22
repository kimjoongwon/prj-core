#!/usr/bin/env node
const { execSync } = require("child_process");

const args = process.argv.slice(2);

// 플래그 파싱
const dryRun = args.includes("--dry-run");
const filteredArgs = args.filter((arg) => !arg.startsWith("--"));

// 패키지명과 버전 타입 추출
const packageName = filteredArgs[0];
const versionType = filteredArgs[1] || "patch";

// 유효한 버전 타입 확인
const validVersionTypes = ["patch", "minor", "major"];
if (!validVersionTypes.includes(versionType)) {
  console.error(`❌ 유효하지 않은 버전 타입: ${versionType}`);
  console.log("사용 가능한 버전 타입: patch, minor, major");
  process.exit(1);
}

/**
 * npm 로그인 상태 확인
 */
function checkNpmAuth() {
  console.log("\n🔐 npm 인증 상태 확인 중...");

  try {
    const username = execSync("npm whoami", { encoding: "utf8" }).trim();
    console.log(`✅ npm 로그인 확인: ${username}\n`);
    return true;
  } catch (error) {
    console.log("\n" + "=".repeat(60));
    console.error("❌ npm 토큰이 만료되었거나 로그인되지 않았습니다.");
    console.log("=".repeat(60));
    console.log("\n💡 다음 명령어로 로그인하세요:\n");
    console.log("   npm login\n");
    console.log("또는 토큰을 직접 설정:\n");
    console.log("   npm config set //registry.npmjs.org/:_authToken=YOUR_TOKEN\n");
    console.log("=".repeat(60) + "\n");
    return false;
  }
}

/**
 * 전체 패키지 릴리즈
 */
function releaseAll() {
  console.log(
    `\n🚀 전체 패키지 릴리즈 시작 (${versionType})${dryRun ? " [DRY RUN]" : ""}\n`
  );
  console.log("=".repeat(60));

  try {
    // 1. 전체 버전 업데이트
    console.log("\n1️⃣  전체 패키지 버전 업데이트");
    console.log("-".repeat(60));
    execSync(`pnpm version:${versionType}`, { stdio: "inherit" });

    // 2. 전체 빌드
    console.log("\n2️⃣  전체 패키지 빌드");
    console.log("-".repeat(60));
    execSync("pnpm build:packages", { stdio: "inherit" });

    // 2.5 번들 사이즈 분석
    console.log("\n📊 번들 사이즈 분석");
    console.log("-".repeat(60));
    execSync("node scripts/show-bundle-sizes.js", { stdio: "inherit" });

    // 3. 전체 배포
    console.log("\n3️⃣  전체 패키지 배포");
    console.log("-".repeat(60));
    const publishCmd = dryRun ? "pnpm publish:dry" : "pnpm publish:packages";
    execSync(publishCmd, { stdio: "inherit" });

    // 4. apps 의존성 업데이트
    if (!dryRun) {
      console.log("\n4️⃣  Apps 의존성 업데이트");
      console.log("-".repeat(60));
      execSync("node scripts/update-app-deps.js", { stdio: "inherit" });
    } else {
      console.log("\n⏭️  Apps 의존성 업데이트 건너뛰기 (DRY RUN)");
    }

    console.log("\n" + "=".repeat(60));
    console.log(`✅ 전체 패키지 릴리즈 완료!${dryRun ? " (DRY RUN)" : ""}`);
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
}

/**
 * 단일 패키지 릴리즈
 */
function releaseSingle(pkgName) {
  console.log(
    `\n🚀 ${pkgName} 릴리즈 시작 (${versionType})${dryRun ? " [DRY RUN]" : ""}\n`
  );
  console.log("=".repeat(60));

  try {
    // 1. 버전 업데이트
    console.log("\n1️⃣  버전 업데이트");
    console.log("-".repeat(60));
    execSync(`node scripts/version-pkg.js ${pkgName} ${versionType}`, {
      stdio: "inherit",
    });

    // 2. 빌드
    console.log("\n2️⃣  빌드");
    console.log("-".repeat(60));
    execSync(`pnpm build:pkg ${pkgName}`, { stdio: "inherit" });

    // 2.5 번들 사이즈 분석
    console.log("\n📊 번들 사이즈 분석");
    console.log("-".repeat(60));
    execSync(`node scripts/analyze-bundle-size.js ${pkgName}`, {
      stdio: "inherit",
    });

    // 3. 배포
    console.log("\n3️⃣  배포");
    console.log("-".repeat(60));
    const publishCmd = dryRun
      ? `pnpm --filter ${pkgName} publish --access public --no-git-checks --dry-run`
      : `pnpm --filter ${pkgName} publish --access public --no-git-checks`;
    execSync(publishCmd, { stdio: "inherit" });

    // 4. apps 의존성 업데이트 (dry-run이 아닐 때만)
    if (!dryRun) {
      console.log("\n4️⃣  Apps 의존성 업데이트");
      console.log("-".repeat(60));
      console.log("💡 대화형 모드로 업데이트할 앱을 선택할 수 있습니다.\n");
      execSync("node scripts/update-app-deps.js", { stdio: "inherit" });
    } else {
      console.log("\n⏭️  Apps 의존성 업데이트 건너뛰기 (DRY RUN)");
    }

    console.log("\n" + "=".repeat(60));
    console.log(`✅ ${pkgName} 릴리즈 완료!${dryRun ? " (DRY RUN)" : ""}`);
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
}

// 메인 실행
if (!dryRun && !checkNpmAuth()) {
  process.exit(1);
}

if (packageName) {
  releaseSingle(packageName);
} else {
  releaseAll();
}

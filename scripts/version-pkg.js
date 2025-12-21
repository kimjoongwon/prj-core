#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const [, , packageName, versionType = "patch"] = process.argv;

if (!packageName) {
  console.error("❌ 패키지명을 입력해주세요.");
  console.log(
    "사용법: pnpm version:pkg @cocrepo/api [patch|minor|major]"
  );
  process.exit(1);
}

// 유효한 버전 타입 확인
const validVersionTypes = ["patch", "minor", "major"];
if (!validVersionTypes.includes(versionType)) {
  console.error(
    `❌ 유효하지 않은 버전 타입: ${versionType}`
  );
  console.log("사용 가능한 버전 타입: patch, minor, major");
  process.exit(1);
}

// 패키지 찾기
const packagesDir = path.join(__dirname, "../packages");
let targetPackagePath = null;
let currentVersion = null;

fs.readdirSync(packagesDir).forEach((dir) => {
  const pkgPath = path.join(packagesDir, dir, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    if (pkg.name === packageName) {
      targetPackagePath = path.join(packagesDir, dir);
      currentVersion = pkg.version;
    }
  }
});

if (!targetPackagePath) {
  console.error(`❌ 패키지를 찾을 수 없습니다: ${packageName}`);
  console.log("\n사용 가능한 패키지:");
  fs.readdirSync(packagesDir).forEach((dir) => {
    const pkgPath = path.join(packagesDir, dir, "package.json");
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
      if (pkg.name) {
        console.log(`  - ${pkg.name} (v${pkg.version})`);
      }
    }
  });
  process.exit(1);
}

// 버전 업데이트
try {
  console.log(`\n📦 ${packageName} 버전 업데이트`);
  console.log(`   현재 버전: v${currentVersion}`);
  console.log(`   업데이트 타입: ${versionType}\n`);

  execSync(
    `cd "${targetPackagePath}" && npm version ${versionType} --no-git-tag-version`,
    {
      stdio: "inherit",
    }
  );

  // 업데이트된 버전 읽기
  const pkgPath = path.join(targetPackagePath, "package.json");
  const updatedPkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

  console.log(`\n✅ 버전 업데이트 완료: v${currentVersion} → v${updatedPkg.version}\n`);
} catch (error) {
  console.error("\n❌ 버전 업데이트 실패\n");
  process.exit(1);
}

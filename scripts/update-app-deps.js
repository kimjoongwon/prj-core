#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

// 업데이트할 앱 목록
const apps = ["admin", "mobile", "server", "storybook"];

// 패키지 버전 읽기
const packagesDir = path.join(__dirname, "../packages");
const packageVersions = {};

console.log("📦 패키지 버전 수집 중...\n");

fs.readdirSync(packagesDir).forEach((dir) => {
  const pkgPath = path.join(packagesDir, dir, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    if (pkg.name && pkg.version) {
      packageVersions[pkg.name] = pkg.version;
      console.log(`  ✓ ${pkg.name}@${pkg.version}`);
    }
  }
});

console.log("\n📱 앱 의존성 업데이트 중...\n");

// 앱의 의존성 업데이트
apps.forEach((appName) => {
  const appPkgPath = path.join(__dirname, "../apps", appName, "package.json");

  if (!fs.existsSync(appPkgPath)) {
    console.log(`⚠️  ${appName} 앱을 찾을 수 없습니다.`);
    return;
  }

  const appPkg = JSON.parse(fs.readFileSync(appPkgPath, "utf8"));
  let updated = false;

  // dependencies와 devDependencies 모두 확인
  ["dependencies", "devDependencies"].forEach((depType) => {
    if (!appPkg[depType]) return;

    Object.keys(appPkg[depType]).forEach((depName) => {
      if (packageVersions[depName]) {
        const currentVersion = appPkg[depType][depName];
        const newVersion = packageVersions[depName];

        // workspace:* 또는 @cocrepo/ 패키지인 경우 업데이트
        if (
          currentVersion === "workspace:*" ||
          (depName.startsWith("@cocrepo/") && currentVersion !== newVersion)
        ) {
          appPkg[depType][depName] = newVersion;
          console.log(
            `  ✅ ${appName}: ${depName} ${currentVersion} → ${newVersion}`
          );
          updated = true;
        }
      }
    });
  });

  if (updated) {
    fs.writeFileSync(appPkgPath, JSON.stringify(appPkg, null, 2) + "\n");
    console.log(`  💾 ${appName} package.json 업데이트 완료\n`);
  } else {
    console.log(`  ℹ️  ${appName}는 업데이트할 의존성이 없습니다.\n`);
  }
});

console.log("🎉 모든 앱의 의존성 업데이트 완료!");

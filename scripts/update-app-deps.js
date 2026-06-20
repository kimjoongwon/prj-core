#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");

// 사용 가능한 앱 목록
const availableApps = ["admin", "server", "storybook"];

// 커맨드 라인 인자에서 앱 목록 가져오기
const selectedApps = process.argv.slice(2);

// readline 인터페이스 생성
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 프롬프트 함수
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
}

// 앱 선택 함수
async function selectApps() {
  console.log("\n📱 업데이트할 앱을 선택해주세요:");
  console.log(`=${"=".repeat(59)}`);

  const appsToUpdate = [];

  for (const app of availableApps) {
    const answer = await prompt(`  ${app} 업데이트? (y/n) [y]: `);
    if (answer === "" || answer === "y" || answer === "yes") {
      appsToUpdate.push(app);
      console.log(`  ✅ ${app} 선택됨`);
    } else {
      console.log(`  ⏭️  ${app} 건너뜀`);
    }
  }

  console.log(`=${"=".repeat(59)}\n`);

  return appsToUpdate;
}

// 패키지 버전 읽기
function getPackageVersions() {
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

  return packageVersions;
}

// workspace 프로토콜로 버전 범위 생성
function getWorkspaceVersion(version) {
  // 버전에서 메이저.마이너 추출 (예: 0.3.6 → ^0.3.0)
  const [major, minor] = version.split(".");
  return `workspace:^${major}.${minor}.0`;
}

// 앱 의존성 업데이트
function updateAppDependencies(apps, packageVersions) {
  console.log("\n📱 앱 의존성 업데이트 중...\n");

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
          const packageVersion = packageVersions[depName];

          // workspace: 프로토콜을 사용하는 경우만 업데이트
          if (currentVersion.startsWith("workspace:")) {
            const newVersion = getWorkspaceVersion(packageVersion);

            if (currentVersion !== newVersion) {
              appPkg[depType][depName] = newVersion;
              console.log(
                `  ✅ ${appName}: ${depName} ${currentVersion} → ${newVersion}`
              );
              updated = true;
            } else {
              console.log(
                `  ℹ️  ${appName}: ${depName} 이미 최신 버전 (${currentVersion})`
              );
            }
          }
        }
      });
    });

    if (updated) {
      fs.writeFileSync(appPkgPath, `${JSON.stringify(appPkg, null, 2)}\n`);
      console.log(`  💾 ${appName} package.json 업데이트 완료\n`);
    } else {
      console.log(`  ℹ️  ${appName}는 업데이트할 의존성이 없습니다.\n`);
    }
  });
}

// 메인 실행
async function main() {
  try {
    let appsToUpdate;

    // 커맨드 라인에서 앱이 지정된 경우
    if (selectedApps.length > 0) {
      appsToUpdate = selectedApps.filter(app => availableApps.includes(app));
      console.log(`\n📱 선택된 앱: ${appsToUpdate.join(", ")}\n`);
    } else {
      // 대화형 모드
      appsToUpdate = await selectApps();
    }

    if (appsToUpdate.length === 0) {
      console.log("⚠️  업데이트할 앱이 선택되지 않았습니다.");
      rl.close();
      return;
    }

    const packageVersions = getPackageVersions();
    updateAppDependencies(appsToUpdate, packageVersions);

    console.log("🎉 모든 앱의 의존성 업데이트 완료!");
    rl.close();
  } catch (error) {
    console.error("❌ 오류 발생:", error.message);
    rl.close();
    process.exit(1);
  }
}

main();

#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

// 인자: [앱 필터 ...] [--dry-run]
// - 앱 필터 없음: 발견된 모든 앱 대상
// - 앱 필터: package.json의 name 또는 디렉터리명(예: admin/web, idp-web)과 부분 일치
// - --dry-run: 변경 예정만 출력하고 파일을 쓰지 않음
const rawArguments = process.argv.slice(2);
const isDryRun = rawArguments.includes("--dry-run");
const appFilters = rawArguments.filter((argument) => argument !== "--dry-run");

// apps/*/package.json 과 apps/*/*/package.json(core/api, admin/web 등 중첩 구조)을 모두 수집
function discoverWorkspaceApps() {
  const appsRoot = path.join(__dirname, "../apps");
  const discoveredApps = [];

  for (const entry of fs.readdirSync(appsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const directManifest = path.join(appsRoot, entry.name, "package.json");
    if (fs.existsSync(directManifest)) {
      discoveredApps.push(directManifest);
      continue;
    }

    for (const nestedEntry of fs.readdirSync(
      path.join(appsRoot, entry.name),
      { withFileTypes: true },
    )) {
      if (!nestedEntry.isDirectory()) continue;
      const nestedManifest = path.join(
        appsRoot,
        entry.name,
        nestedEntry.name,
        "package.json",
      );
      if (fs.existsSync(nestedManifest)) {
        discoveredApps.push(nestedManifest);
      }
    }
  }

  return discoveredApps;
}

// 공개 패키지 버전 수집 (packages/*/package.json)
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

// workspace 프로토콜로 버전 범위 생성 (예: 2.0.0 → workspace:^2.0.0)
function getWorkspaceVersion(version) {
  const [major, minor] = version.split(".");
  return `workspace:^${major}.${minor}.0`;
}

function matchesAppFilter(manifestPath, appFilters) {
  if (appFilters.length === 0) return true;

  const appName = JSON.parse(fs.readFileSync(manifestPath, "utf8")).name ?? "";
  const relativeDir = path.relative(
    path.join(__dirname, "../apps"),
    path.dirname(manifestPath),
  );

  return appFilters.some(
    (filter) => appName === filter || relativeDir.includes(filter),
  );
}

// 앱 의존성 업데이트
function updateAppDependencies(appManifests, packageVersions) {
  console.log("\n📱 앱 의존성 업데이트 중...\n");

  for (const appPkgPath of appManifests) {
    const relativeDir = path.relative(
      path.join(__dirname, "../apps"),
      path.dirname(appPkgPath),
    );
    const appPkg = JSON.parse(fs.readFileSync(appPkgPath, "utf8"));
    let updated = false;

    ["dependencies", "devDependencies"].forEach((depType) => {
      if (!appPkg[depType]) return;

      Object.keys(appPkg[depType]).forEach((depName) => {
        if (!packageVersions[depName]) return;

        const currentVersion = appPkg[depType][depName];
        if (!currentVersion.startsWith("workspace:")) return;

        const newVersion = getWorkspaceVersion(packageVersions[depName]);
        if (currentVersion === newVersion) {
          console.log(
            `  ℹ️  ${relativeDir}: ${depName} 이미 최신 버전 (${currentVersion})`,
          );
          return;
        }

        appPkg[depType][depName] = newVersion;
        console.log(
          `  ✅ ${relativeDir}: ${depName} ${currentVersion} → ${newVersion}`,
        );
        updated = true;
      });
    });

    if (updated) {
      if (isDryRun) {
        console.log(`  🔍 ${relativeDir} dry-run — 파일 쓰기 생략\n`);
      } else {
        fs.writeFileSync(appPkgPath, `${JSON.stringify(appPkg, null, 2)}\n`);
        console.log(`  💾 ${relativeDir} package.json 업데이트 완료\n`);
      }
    } else {
      console.log(`  ℹ️  ${relativeDir}는 업데이트할 의존성이 없습니다.\n`);
    }
  }
}

function main() {
  const allManifests = discoverWorkspaceApps();
  const appManifests = allManifests.filter((manifestPath) =>
    matchesAppFilter(manifestPath, appFilters),
  );

  if (appManifests.length === 0) {
    console.log("⚠️  업데이트할 앱을 찾지 못했습니다.");
    console.log(
      `  발견된 앱: ${allManifests
        .map((manifestPath) =>
          path.relative(path.join(__dirname, "../apps"), path.dirname(manifestPath)),
        )
        .join(", ")}`,
    );
    process.exit(1);
  }

  console.log(`📱 대상 앱: ${appManifests
    .map((manifestPath) =>
      path.relative(path.join(__dirname, "../apps"), path.dirname(manifestPath)),
    )
    .join(", ")}${isDryRun ? " (dry-run)" : ""}\n`);

  const packageVersions = getPackageVersions();
  updateAppDependencies(appManifests, packageVersions);

  console.log("🎉 모든 앱의 의존성 업데이트 완료!");
}

main();

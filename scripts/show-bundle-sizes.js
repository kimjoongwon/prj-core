#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

/**
 * 모든 패키지의 번들 사이즈를 분석하고 표시
 */
function showAllBundleSizes() {
  const packagesDir = path.join(__dirname, "../packages");
  const packages = fs.readdirSync(packagesDir);

  const results = {
    bundled: [],
    source: [],
  };

  // 각 패키지 분석
  packages.forEach((pkgName) => {
    const packagePath = path.join(packagesDir, pkgName);
    const packageJsonPath = path.join(packagePath, "package.json");

    if (!fs.existsSync(packageJsonPath)) {
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    const buildScript = packageJson.scripts?.build || "";
    const pkgFullName = packageJson.name || `@cocrepo/${pkgName}`;

    // 빌드 방식 판단
    if (buildScript.includes("echo") || !buildScript.includes("tsup")) {
      // 소스 직접 배포
      results.source.push({
        name: pkgFullName,
        version: packageJson.version,
      });
    } else {
      // tsup 번들링
      const distPath = path.join(packagePath, "dist");
      if (fs.existsSync(distPath)) {
        const sizes = {
          name: pkgFullName,
          version: packageJson.version,
          cjs: null,
          esm: null,
          dts: null,
        };

        const distFiles = fs.readdirSync(distPath);

        // 번들 파일 찾기
        for (const file of distFiles) {
          if (file === "index.js") {
            const stats = fs.statSync(path.join(distPath, file));
            sizes.cjs = (stats.size / 1024).toFixed(2);
          } else if (file === "index.mjs") {
            const stats = fs.statSync(path.join(distPath, file));
            sizes.esm = (stats.size / 1024).toFixed(2);
          } else if (file === "index.d.ts") {
            const stats = fs.statSync(path.join(distPath, file));
            sizes.dts = (stats.size / 1024).toFixed(2);
          }
        }

        if (sizes.cjs || sizes.esm) {
          results.bundled.push(sizes);
        }
      } else {
        results.source.push({
          name: pkgFullName,
          version: packageJson.version,
        });
      }
    }
  });

  // 결과 출력
  console.log(`\n${"=".repeat(80)}`);
  console.log("📦 모든 패키지 번들 사이즈 분석");
  console.log("=".repeat(80));

  // 번들링된 패키지
  if (results.bundled.length > 0) {
    console.log("\n✅ 번들링 패키지 (tsup)\n");

    // 헤더
    console.log(
      `${"패키지".padEnd(30)} ${"버전".padEnd(10)} ${"CJS".padEnd(10)} ${"ESM".padEnd(10)} ${"Types".padEnd(10)} ${"차이율"}`
    );
    console.log("-".repeat(80));

    // 데이터
    results.bundled.forEach((pkg) => {
      const cjsKb = pkg.cjs ? parseFloat(pkg.cjs) : 0;
      const esmKb = pkg.esm ? parseFloat(pkg.esm) : 0;
      const diff =
        cjsKb && esmKb
          ? (
              `${((Math.abs(cjsKb - esmKb) / Math.max(cjsKb, esmKb)) * 100).toFixed(
                1
              )}%`
            ).padEnd(10)
          : "-".padEnd(10);

      console.log(
        `${pkg.name.padEnd(30)} ${pkg.version.padEnd(10)} ${(`${pkg.cjs} KB`).padEnd(10)} ${(`${pkg.esm} KB`).padEnd(10)} ${(`${pkg.dts} KB`).padEnd(10)} ${diff}`
      );
    });

    // 합계
    const totalCjs = results.bundled.reduce((sum, pkg) => sum + parseFloat(pkg.cjs || 0), 0);
    const totalEsm = results.bundled.reduce((sum, pkg) => sum + parseFloat(pkg.esm || 0), 0);
    const totalDts = results.bundled.reduce((sum, pkg) => sum + parseFloat(pkg.dts || 0), 0);

    console.log("-".repeat(80));
    console.log(
      `${"합계".padEnd(30)} ${"".padEnd(10)} ${(`${totalCjs.toFixed(2)} KB`).padEnd(10)} ${(`${totalEsm.toFixed(2)} KB`).padEnd(10)} ${(`${totalDts.toFixed(2)} KB`).padEnd(10)}`
    );
  }

  // 소스 직접 배포 패키지
  if (results.source.length > 0) {
    console.log("\n\n📁 소스 직접 배포 패키지 (번들링 없음)\n");

    console.log(`${"패키지".padEnd(40)} ${"버전"}`);
    console.log("-".repeat(80));

    results.source.forEach((pkg) => {
      console.log(`${pkg.name.padEnd(40)} ${pkg.version}`);
    });
  }

  console.log(`\n${"=".repeat(80)}\n`);

  // 통계
  console.log("📊 통계:");
  console.log(`  📦 번들링 패키지: ${results.bundled.length}개`);
  console.log(`  📁 소스 직접 배포: ${results.source.length}개`);
  console.log(`  📌 전체 패키지: ${results.bundled.length + results.source.length}개\n`);
}

// 메인 실행
showAllBundleSizes();

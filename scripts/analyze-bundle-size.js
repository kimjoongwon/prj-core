#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

/**
 * 번들 사이즈 분석 및 표시
 * @param {string} packageName - 패키지명 (예: @cocrepo/toolkit)
 */
function analyzeBundleSize(packageName) {
  // 패키지 경로 추출
  const [scope, name] = packageName.split("/");
  const packagePath = path.join(
    __dirname,
    "..",
    "packages",
    name || scope
  );

  // package.json 읽어서 빌드 방식 확인
  const packageJsonPath = path.join(packagePath, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    console.warn(`⚠️  package.json을 찾을 수 없습니다: ${packageJsonPath}`);
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const buildScript = packageJson.scripts?.build || "";

  // 소스 직접 배포하는 패키지는 번들 사이즈 분석 스킵 (echo만 있는 경우)
  if (buildScript.includes("echo") && !buildScript.includes("tsc") && !buildScript.includes("tsup")) {
    console.log(`\n${"=".repeat(60)}`);
    console.log("ℹ️  번들 사이즈 분석");
    console.log("=".repeat(60));
    console.log(`📦 패키지: ${packageName}`);
    console.log(`📌 빌드 방식: 소스 직접 배포 (번들링 없음)`);
    console.log("💡 dist 폴더가 없는 패키지입니다.");
    console.log(`${"=".repeat(60)}\n`);
    return;
  }

  // dist 폴더 확인
  const distPath = path.join(packagePath, "dist");
  if (!fs.existsSync(distPath)) {
    console.warn(`⚠️  dist 폴더를 찾을 수 없습니다: ${distPath}`);
    return;
  }

  const files = {
    cjs: null,
    esm: null,
    dts: null,
  };

  // 파일 검색
  const distFiles = fs.readdirSync(distPath);

  for (const file of distFiles) {
    if (file === "index.mjs") {
      files.esm = file;
    } else if (file === "index.js") {
      files.cjs = file;
    } else if (file === "index.d.ts") {
      files.dts = file;
    }
  }

  // 사이즈 계산
  const sizes = {};
  for (const [key, file] of Object.entries(files)) {
    if (file) {
      const filePath = path.join(distPath, file);
      const stats = fs.statSync(filePath);
      sizes[key] = {
        file,
        bytes: stats.size,
        kb: (stats.size / 1024).toFixed(2),
      };
    }
  }

  // 번들 사이즈가 없으면 종료
  if (Object.keys(sizes).length === 0) {
    console.log(`\n${"=".repeat(60)}`);
    console.log("ℹ️  번들 사이즈 분석");
    console.log("=".repeat(60));
    console.log(`📦 패키지: ${packageName}`);
    console.log(`📌 빌드 결과: 번들 파일을 찾을 수 없습니다.`);
    console.log(`${"=".repeat(60)}\n`);
    return;
  }

  // 번들 사이즈 출력
  console.log(`\n${"=".repeat(60)}`);
  console.log("📦 번들 사이즈 분석");
  console.log("=".repeat(60));

  if (sizes.cjs) {
    console.log(
      `📄 CJS  : ${sizes.cjs.file.padEnd(30)} ${sizes.cjs.kb.padStart(8)} KB`
    );
  }

  if (sizes.esm) {
    console.log(
      `📦 ESM  : ${sizes.esm.file.padEnd(30)} ${sizes.esm.kb.padStart(8)} KB`
    );
  }

  if (sizes.dts) {
    console.log(
      `📋 Types: ${sizes.dts.file.padEnd(30)} ${sizes.dts.kb.padStart(8)} KB`
    );
  }

  // 비교 정보
  if (sizes.cjs && sizes.esm) {
    const cjsBytes = sizes.cjs.bytes;
    const esmBytes = sizes.esm.bytes;
    const diff = Math.abs(cjsBytes - esmBytes);
    const diffPercent = ((diff / Math.max(cjsBytes, esmBytes)) * 100).toFixed(1);
    const smaller = cjsBytes < esmBytes ? "CJS" : "ESM";

    console.log("-".repeat(60));
    console.log(
      `💡 ${smaller}이 ${diffPercent}% 작습니다 (차이: ${(diff / 1024).toFixed(2)} KB)`
    );
  }

  console.log(`${"=".repeat(60)}\n`);
}

// 메인 실행
const packageName = process.argv[2];
if (!packageName) {
  console.error("❌ 패키지명을 입력해주세요.");
  console.log("사용법: node scripts/analyze-bundle-size.js @cocrepo/toolkit");
  process.exit(1);
}

analyzeBundleSize(packageName);

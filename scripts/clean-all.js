#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.join(__dirname, "..");

/**
 * 디렉토리 삭제 (존재하는 경우에만)
 */
function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    return true;
  }
  return false;
}

/**
 * 특정 이름의 디렉토리를 재귀적으로 찾아서 삭제
 */
function findAndRemove(baseDir, targetName) {
  let count = 0;

  if (!fs.existsSync(baseDir)) return count;

  const entries = fs.readdirSync(baseDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const fullPath = path.join(baseDir, entry.name);

    if (entry.name === targetName) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      count++;
    } else if (entry.name !== "node_modules") {
      // node_modules 내부는 탐색하지 않음
      count += findAndRemove(fullPath, targetName);
    }
  }

  return count;
}

console.log("🧹 전체 정리 시작...\n");

// 1. 루트 캐시 정리
console.log("1️⃣  루트 캐시 정리");
let cleaned = false;
if (removeDir(path.join(rootDir, "node_modules/.cache"))) {
  console.log("   ✓ node_modules/.cache 삭제됨");
  cleaned = true;
}
if (removeDir(path.join(rootDir, ".turbo"))) {
  console.log("   ✓ .turbo 삭제됨");
  cleaned = true;
}
if (!cleaned) console.log("   - 삭제할 캐시 없음");

// 2. packages, apps 내 dist 삭제
console.log("\n2️⃣  dist 폴더 삭제");
let distCount = 0;
distCount += findAndRemove(path.join(rootDir, "packages"), "dist");
distCount += findAndRemove(path.join(rootDir, "apps"), "dist");
console.log(`   ✓ ${distCount}개의 dist 폴더 삭제됨`);

// 3. packages, apps 내 .turbo 삭제
console.log("\n3️⃣  .turbo 폴더 삭제");
let turboCount = 0;
turboCount += findAndRemove(path.join(rootDir, "packages"), ".turbo");
turboCount += findAndRemove(path.join(rootDir, "apps"), ".turbo");
console.log(`   ✓ ${turboCount}개의 .turbo 폴더 삭제됨`);

// 4. 루트 node_modules 삭제
console.log("\n4️⃣  루트 node_modules 삭제");
if (removeDir(path.join(rootDir, "node_modules"))) {
  console.log("   ✓ node_modules 삭제됨");
} else {
  console.log("   - node_modules 없음");
}

// 5. packages, apps 내 node_modules 삭제
console.log("\n5️⃣  하위 프로젝트 node_modules 삭제");
let nmCount = 0;
nmCount += findAndRemove(path.join(rootDir, "packages"), "node_modules");
nmCount += findAndRemove(path.join(rootDir, "apps"), "node_modules");
console.log(`   ✓ ${nmCount}개의 node_modules 폴더 삭제됨`);

console.log(`\n${"=".repeat(50)}`);
console.log("✅ 전체 정리 완료!");
console.log("=".repeat(50));
console.log("\n💡 다시 설치하려면: pnpm install\n");

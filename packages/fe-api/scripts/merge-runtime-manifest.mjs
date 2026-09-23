// core·idp 두 스펙의 런타임 매니페스트 파편을 합쳐 runtimeManifest.ts를 쓴다.
// transformer가 각 프로젝트 코드젠 시 src/libs/runtimeManifest.<project>.json을
// 기록하고, orval afterAllFilesWrite 훅이 이 스크립트를 실행한다.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const libsDir = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	"../src/libs",
);

const fragmentFiles = [
	"runtimeManifest.core.json",
	"runtimeManifest.idp.json",
];

const fragments = fragmentFiles
	.map((fileName) => path.join(libsDir, fileName))
	.filter((filePath) => existsSync(filePath))
	.map((filePath) => JSON.parse(readFileSync(filePath, "utf8")));

if (fragments.length === 0) {
	throw new Error("런타임 매니페스트 파편이 없습니다 — codegen을 먼저 실행하세요.");
}

// 같은 operationId가 양쪽 스펙에 있으면(idp 계열) 뒤의 파편(idp)이 이긴다.
const operationsByld = new Map();
const schemas = {};
for (const fragment of fragments) {
	for (const operation of fragment.operations ?? []) {
		operationsByld.set(operation.operationId, operation);
	}
	Object.assign(schemas, fragment.schemas ?? {});
}

const merged = {
	operations: [...operationsByld.values()],
	schemas,
};

const source = `// Orval input transformer가 codegen 시 갱신합니다.\nimport type { RuntimeManifest } from "./runtimeSchema";\n\nexport const runtimeManifest: RuntimeManifest = ${JSON.stringify(merged, null, 2)};\n`;
writeFileSync(path.join(libsDir, "runtimeManifest.ts"), source);
console.log(
	`런타임 매니페스트 병합 완료 — ${merged.operations.length}개 operation / ${Object.keys(schemas).length}개 schema`,
);

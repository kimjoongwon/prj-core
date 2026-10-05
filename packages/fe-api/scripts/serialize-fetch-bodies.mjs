// orval fetch 생성기가 요청 본문을 `body: JSON.stringify(dto)`로 인라인
// 직렬화한다. bigint는 JSON.stringify에서 TypeError가 나므로, 생성 직후
// 본문 직렬화를 bigint 안전 직렬화(apiJsonStringify)로 교체한다.
// orval afterAllFilesWrite 훅이 codegen마다 실행하며 멱등하다.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);
const generatedRoots = [
	path.join(packageRoot, "src/core"),
	path.join(packageRoot, "src/idp"),
];
const mutatorModuleId = "customFetch";

const listTypeScriptFiles = (dir) =>
	readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const entryPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			return listTypeScriptFiles(entryPath);
		}
		return entry.name.endsWith(".ts") ? [entryPath] : [];
	});

let rewrittenFileCount = 0;

for (const generatedRoot of generatedRoots) {
	for (const filePath of listTypeScriptFiles(generatedRoot)) {
		const source = readFileSync(filePath, "utf8");
		if (!source.includes("body: JSON.stringify(")) {
			continue;
		}

		let nextSource = source.replaceAll(
			"body: JSON.stringify(",
			"body: apiJsonStringify(",
		);

		const mutatorImportPattern = new RegExp(
			`import \\{([^}]*)\\} from '([^']*)${mutatorModuleId}';`,
		);
		const mutatorImport = nextSource.match(mutatorImportPattern);
		if (!mutatorImport) {
			throw new Error(
				`${path.relative(packageRoot, filePath)}에 ${mutatorModuleId} import가 없어 apiJsonStringify를 연결할 수 없습니다.`,
			);
		}
		if (!mutatorImport[1].includes("apiJsonStringify")) {
			// biome 정렬 형태(import { a, b } from '...')로 정규화해 출력한다.
			const importedNames = mutatorImport[1]
				.split(",")
				.map((name) => name.trim())
				.filter(Boolean);
			importedNames.push("apiJsonStringify");
			const normalizedImport = `import { ${[...new Set(importedNames)].sort((a, b) => a.localeCompare(b)).join(", ")} } from '$2${mutatorModuleId}';`;
			nextSource = nextSource.replace(
				mutatorImportPattern,
				normalizedImport,
			);
		}

		writeFileSync(filePath, nextSource);
		rewrittenFileCount += 1;
	}
}

console.log(
	`요청 본문 직렬화 안전화 완료 — ${rewrittenFileCount}개 파일에 apiJsonStringify 적용`,
);

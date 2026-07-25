import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import {
	formatSchemaCheckSuccess,
	normalizeSchemaRelativePath,
	type SchemaConventionInput,
	validateSchemaConventions,
} from "./schema-conventions";

const schemaDir = path.resolve(__dirname, "../schema");

/**
 * schema 디렉터리의 Prisma 파일과 하위 디렉터리를 수집합니다.
 *
 * @param dir 현재 탐색 디렉터리
 * @param rootDir 상대 경로 계산 기준
 * @returns 검증기에 전달할 파일 내용과 디렉터리 목록
 */
function collectSchemaInput(
	dir: string,
	rootDir: string = dir,
): SchemaConventionInput {
	const input: SchemaConventionInput = { directories: [], files: [] };
	const entries = readdirSync(dir, { withFileTypes: true }).sort(
		(left, right) => left.name.localeCompare(right.name),
	);

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		const relativePath = normalizeSchemaRelativePath(
			path.relative(rootDir, fullPath),
		);

		if (entry.isDirectory()) {
			input.directories?.push(relativePath);
			const childInput = collectSchemaInput(fullPath, rootDir);
			input.directories?.push(...(childInput.directories ?? []));
			input.files.push(...childInput.files);
			continue;
		}

		if (entry.isFile() && entry.name.endsWith(".prisma")) {
			input.files.push({
				path: relativePath,
				text: readFileSync(fullPath, "utf-8"),
			});
		}
	}

	return input;
}

/**
 * schema 계약 검증 CLI를 실행합니다.
 */
function main(): void {
	if (!existsSync(schemaDir)) {
		console.error(`[schema:check] schema directory not found: ${schemaDir}`);
		process.exit(1);
	}

	const result = validateSchemaConventions(collectSchemaInput(schemaDir));

	if (result.errors.length > 0) {
		console.error("[schema:check] FAILED");
		for (const error of result.errors) {
			console.error(`- ${error}`);
		}
		process.exit(1);
	}

	console.log(formatSchemaCheckSuccess(result.summary));
}

main();

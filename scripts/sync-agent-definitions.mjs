import {
	existsSync,
	lstatSync,
	mkdirSync,
	readdirSync,
	writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
	AGENT_DEFINITION_COUNT,
	parseCodexAgentDefinition,
	readAgentDefinitionSource,
	renderZcodeAgentDefinition,
} from "./agent-definition-format.mjs";

const scriptPath = fileURLToPath(import.meta.url);
const repositoryRoot = resolve(dirname(scriptPath), "..");

function collectDefinitionPaths(directoryPath, acceptsPath) {
	if (!existsSync(directoryPath)) return [];
	return readdirSync(directoryPath)
		.sort()
		.flatMap((entryName) => {
			const entryPath = join(directoryPath, entryName);
			const entryStat = lstatSync(entryPath);
			if (entryStat.isDirectory())
				return collectDefinitionPaths(entryPath, acceptsPath);
			return acceptsPath(entryPath) ? [entryPath] : [];
		});
}

// 전체 입력과 mapping을 먼저 확인하여 잘못된 입력 때문에 일부만 쓰는 일을 막습니다.
function planAgentDefinitionSync(root) {
	const errors = [];
	const codexDirectory = join(root, ".codex", "agents");
	const zcodeDirectory = join(root, ".zcode", "agents");
	const codexPaths = collectDefinitionPaths(codexDirectory, (path) =>
		path.endsWith(".toml"),
	);
	const definitions = [];
	const names = new Set();
	if (codexPaths.length !== AGENT_DEFINITION_COUNT)
		errors.push(
			`.codex/agents/: 원본은 ${AGENT_DEFINITION_COUNT}개여야 합니다. 현재 ${codexPaths.length}개입니다.`,
		);
	for (const codexPath of codexPaths) {
		const relativeSourcePath = relative(root, codexPath);
		try {
			if (
				lstatSync(codexPath).isSymbolicLink() ||
				dirname(codexPath) !== codexDirectory
			)
				throw new Error(
					"원본은 .codex/agents/ 바로 아래의 일반 파일이어야 합니다.",
				);
			const definition = parseCodexAgentDefinition(
				readAgentDefinitionSource(codexPath),
				relativeSourcePath,
			);
			if (basename(codexPath, ".toml") !== definition.name)
				throw new Error("파일명과 name이 다릅니다.");
			if (names.has(definition.name))
				throw new Error(`중복 역할명 "${definition.name}"입니다.`);
			names.add(definition.name);
			const targetPath = join(zcodeDirectory, `${definition.name}.md`);
			if (existsSync(targetPath) && !lstatSync(targetPath).isFile())
				throw new Error("생성 대상은 일반 파일이어야 합니다.");
			definitions.push({
				codexPath,
				targetPath,
				expectedSource: renderZcodeAgentDefinition(definition),
				currentSource: existsSync(targetPath)
					? readAgentDefinitionSource(targetPath)
					: undefined,
			});
		} catch (error) {
			errors.push(`${relativeSourcePath}: ${error.message}`);
		}
	}
	const expectedTargets = new Set(
		definitions.map((definition) => definition.targetPath),
	);
	for (const generatedPath of collectDefinitionPaths(
		zcodeDirectory,
		(path) =>
			/\.(md|markdown)$/.test(path) &&
			!["README.md", "README.markdown"].includes(basename(path)),
	)) {
		if (!expectedTargets.has(generatedPath))
			errors.push(
				`${relative(root, generatedPath)}: 대응하는 .codex/agents/ 원본이 없는 추가 또는 stale 정의입니다. 파일을 자동 삭제하지 않습니다.`,
			);
	}
	return { errors, definitions, definitionCount: codexPaths.length };
}

export function checkAgentDefinitionSync(root = repositoryRoot) {
	const { errors, definitions, definitionCount } =
		planAgentDefinitionSync(root);
	const driftPaths = [];
	for (const definition of definitions) {
		if (definition.currentSource === definition.expectedSource) continue;
		const generatedPath = relative(root, definition.targetPath);
		driftPaths.push(generatedPath);
		errors.push(
			`${generatedPath}: 생성본이 없거나 원본 ${relative(root, definition.codexPath)}의 변환 결과와 다릅니다. 편집 의도를 원본에서 확인한 뒤 pnpm agents:sync로 재생성하세요. 재현: pnpm agents:sync:check`,
		);
	}
	return { errors, definitionCount, driftPaths };
}

export function syncAgentDefinitions(root = repositoryRoot) {
	const { errors, definitions, definitionCount } =
		planAgentDefinitionSync(root);
	const writtenPaths = [];
	if (errors.length) return { errors, definitionCount, writtenPaths };
	for (const definition of definitions) {
		if (definition.currentSource === definition.expectedSource) continue;
		mkdirSync(dirname(definition.targetPath), { recursive: true });
		writeFileSync(definition.targetPath, definition.expectedSource, "utf8");
		writtenPaths.push(relative(root, definition.targetPath));
	}
	return { errors, definitionCount, writtenPaths };
}

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
	try {
		const arguments_ = process.argv.slice(2);
		let root = repositoryRoot;
		let isCheck = false;
		for (
			let argumentIndex = 0;
			argumentIndex < arguments_.length;
			argumentIndex += 1
		) {
			const argument = arguments_[argumentIndex];
			if (argument === "--check") isCheck = true;
			else if (argument === "--root" && arguments_[argumentIndex + 1])
				root = resolve(arguments_[++argumentIndex]);
			else
				throw new Error(
					"사용법: node scripts/sync-agent-definitions.mjs [--check] [--root <저장소 경로>]",
				);
		}
		const syncResult = isCheck
			? checkAgentDefinitionSync(root)
			: syncAgentDefinitions(root);
		if (syncResult.errors.length) {
			console.error(syncResult.errors.join("\n"));
			process.exitCode = 1;
		} else {
			console.log(
				isCheck
					? `Agent definition sync check passed: ${syncResult.definitionCount} generated definitions.`
					: `Agent definitions synced: ${syncResult.definitionCount} definitions, ${syncResult.writtenPaths.length} updated.`,
			);
		}
	} catch (error) {
		console.error(error.message);
		process.exitCode = 1;
	}
}

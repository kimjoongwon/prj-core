import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	rmSync,
	statSync,
	utimesSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import {
	AGENT_DEFINITION_COUNT,
	parseCodexAgentDefinition,
	parseZcodeAgentDefinition,
	readAgentDefinitionSource,
	renderZcodeAgentDefinition,
} from "./agent-definition-format.mjs";
import {
	checkAgentDefinitionSync,
	syncAgentDefinitions,
} from "./sync-agent-definitions.mjs";

const syncScriptPath = resolve(
	import.meta.dirname,
	"sync-agent-definitions.mjs",
);
const fixtureInstructions =
	"## 역할·수정 범위\n\n따옴표 '와 \" 그리고 literal \\n을 보존합니다.\n  들여쓰기\n\n";

function codexFixtureSource(
	agentName = "fixture-agent-0",
	description = "fixture를 변환합니다.",
	instructions = fixtureInstructions,
) {
	return `name = "${agentName}"\ndescription = ${JSON.stringify(description)}\nmodel = "fixture-model"\nmodel_reasoning_effort = "high"\ndeveloper_instructions = '''\n${instructions}'''\n`;
}

function createSourceFixture(testContext) {
	const fixtureRoot = mkdtempSync(join(tmpdir(), "agent-definition-sync-"));
	testContext.after(() =>
		rmSync(fixtureRoot, { recursive: true, force: true }),
	);
	mkdirSync(join(fixtureRoot, ".codex", "agents"), { recursive: true });
	for (
		let agentIndex = 0;
		agentIndex < AGENT_DEFINITION_COUNT;
		agentIndex += 1
	) {
		const agentName = `fixture-agent-${agentIndex}`;
		writeFileSync(
			join(fixtureRoot, ".codex", "agents", `${agentName}.toml`),
			codexFixtureSource(agentName, `fixture ${agentIndex}입니다.`),
		);
	}
	return fixtureRoot;
}

function sourcePath(fixtureRoot, agentIndex = 0) {
	return join(
		fixtureRoot,
		".codex",
		"agents",
		`fixture-agent-${agentIndex}.toml`,
	);
}

function generatedPath(fixtureRoot, agentIndex = 0) {
	return join(
		fixtureRoot,
		".zcode",
		"agents",
		`fixture-agent-${agentIndex}.md`,
	);
}

function rewriteSource(fixturePath, transform) {
	writeFileSync(fixturePath, transform(readFileSync(fixturePath, "utf8")));
}

function generatedSnapshot(fixtureRoot) {
	const directoryPath = join(fixtureRoot, ".zcode", "agents");
	if (!existsSync(directoryPath)) return [];
	return readdirSync(directoryPath)
		.sort()
		.map((entryName) => {
			const filePath = join(directoryPath, entryName);
			return {
				entryName,
				source: readFileSync(filePath, "utf8"),
				mtimeMs: statSync(filePath).mtimeMs,
			};
		});
}

test("TOML quoted description과 literal 본문을 생성 Markdown에서 그대로 보존한다", () => {
	const description = '따옴표 "와 slash \\ 및 #tag, 줄바꿈\n과 한글 😀';
	const definition = parseCodexAgentDefinition(
		codexFixtureSource("fixture-agent-0", description),
	);
	assert.equal(definition.description, description);
	assert.equal(definition.instructions, fixtureInstructions);
	assert.equal(definition.model, "fixture-model");
	assert.equal(definition.modelReasoningEffort, "high");
	const expectedMarkdown = `---\n# 자동 생성: .codex/agents/fixture-agent-0.toml\n# 직접 편집하지 마세요. 원본을 수정한 뒤 pnpm agents:sync를 실행하세요.\nname: fixture-agent-0\ndescription: ${JSON.stringify(description)}\n---\n\n${fixtureInstructions}`;
	const generatedMarkdown = renderZcodeAgentDefinition(definition);
	assert.equal(generatedMarkdown, expectedMarkdown);
	assert.deepEqual(parseZcodeAgentDefinition(generatedMarkdown), {
		name: definition.name,
		description,
		instructions: fixtureInstructions,
	});
	assert.doesNotMatch(generatedMarkdown, /^model(?:_reasoning_effort)?:/m);
});

test("TOML metadata의 literal 문자열·주석·Unicode scalar escape를 처리한다", () => {
	const source = codexFixtureSource()
		.replace('name = "fixture-agent-0"', "name = 'fixture-agent-0' # 이름")
		.replace(
			'description = "fixture를 변환합니다."',
			'description = "\\uD55C\\uAE00 \\U0001F600" # 설명',
		);
	assert.equal(parseCodexAgentDefinition(source).description, "한글 😀");
});

test("CRLF 원본의 literal 본문 줄바꿈과 공백을 보존한다", () => {
	const source = codexFixtureSource().replaceAll("\n", "\r\n");
	const definition = parseCodexAgentDefinition(source);
	assert.equal(
		definition.instructions,
		fixtureInstructions.replaceAll("\n", "\r\n"),
	);
	assert.equal(
		parseZcodeAgentDefinition(renderZcodeAgentDefinition(definition))
			.instructions,
		definition.instructions,
	);
});

test("본문의 metadata처럼 보이는 줄과 첫 줄·닫는 경계 공백을 보존한다", () => {
	const instructions =
		'\nname = "본문 이름"\ndescription = "본문 설명"\nmodel = "본문 모델"\n  ';
	const definition = parseCodexAgentDefinition(
		codexFixtureSource("fixture-agent-0", "진짜 설명", instructions),
	);
	assert.equal(definition.name, "fixture-agent-0");
	assert.equal(definition.description, "진짜 설명");
	assert.equal(definition.model, "fixture-model");
	assert.equal(definition.instructions, instructions);
	assert.equal(
		parseZcodeAgentDefinition(renderZcodeAgentDefinition(definition))
			.instructions,
		instructions,
	);
});

test("YAML 생성 주석은 metadata 필드가 아니며 hash가 포함된 description도 보존한다", () => {
	const source = renderZcodeAgentDefinition(
		parseCodexAgentDefinition(
			codexFixtureSource("fixture-agent-0", '"#schema"를 확인합니다.'),
		),
	);
	assert.equal(
		parseZcodeAgentDefinition(source).description,
		'"#schema"를 확인합니다.',
	);
	assert.throws(
		() =>
			parseZcodeAgentDefinition(
				source.replace(
					"name: fixture-agent-0",
					"name: fixture-agent-0\nmodel: extra",
				),
			),
		/frontmatter 필드 "model"/,
	);
	assert.throws(
		() =>
			parseZcodeAgentDefinition(
				source.replace(
					"name: fixture-agent-0",
					"name: fixture-agent-0\nname: duplicate",
				),
			),
		/중복 frontmatter/,
	);
});

for (const [invalidName, transform] of [
	["중복 필드", (source) => `name = "other"\n${source}`],
	["추가 필드", (source) => `unknown = "unsupported"\n${source}`],
	[
		"숫자 metadata",
		(source) => source.replace('model = "fixture-model"', "model = 12"),
	],
	[
		"미지원 instructions 형식",
		(source) =>
			source.replace(
				"developer_instructions = '''",
				'developer_instructions = """',
			),
	],
	["닫히지 않은 literal", (source) => source.slice(0, -4)],
	[
		"잘못된 escape",
		(source) =>
			source.replace(
				'description = "fixture를 변환합니다."',
				'description = "\\q"',
			),
	],
	[
		"Unicode surrogate escape",
		(source) =>
			source.replace(
				'description = "fixture를 변환합니다."',
				'description = "\\uD800"',
			),
	],
	[
		"Unicode 범위 초과 escape",
		(source) =>
			source.replace(
				'description = "fixture를 변환합니다."',
				'description = "\\U00110000"',
			),
	],
	[
		"metadata 뒤 잔여 구문",
		(source) =>
			source.replace(
				'model = "fixture-model"',
				'model = "fixture-model" extra',
			),
	],
	["raw 제어 문자", (source) => `${source}#\u0001\n`],
	["단독 CR 줄바꿈", (source) => source.replace("\n", "\r")],
	["빈 본문", (source) => source.replace(fixtureInstructions, "")],
]) {
	test(`${invalidName} 형식은 침묵 변환하지 않는다`, () => {
		assert.throws(
			() =>
				parseCodexAgentDefinition(
					transform(codexFixtureSource()),
					"source-role.toml",
				),
			/source-role\.toml:/,
		);
	});
}

test(`${AGENT_DEFINITION_COUNT}개 mapping을 생성하고 모델과 원본 파일을 수정하지 않는다`, (testContext) => {
	const fixtureRoot = createSourceFixture(testContext);
	const beforeSource = readFileSync(sourcePath(fixtureRoot), "utf8");
	const result = syncAgentDefinitions(fixtureRoot);
	assert.deepEqual(result.errors, []);
	assert.equal(result.definitionCount, AGENT_DEFINITION_COUNT);
	assert.equal(result.writtenPaths.length, AGENT_DEFINITION_COUNT);
	assert.equal(readFileSync(sourcePath(fixtureRoot), "utf8"), beforeSource);
	assert.equal(
		readdirSync(join(fixtureRoot, ".zcode", "agents")).length,
		AGENT_DEFINITION_COUNT,
	);
	assert.deepEqual(checkAgentDefinitionSync(fixtureRoot), {
		errors: [],
		definitionCount: AGENT_DEFINITION_COUNT,
		driftPaths: [],
	});
});

test("같은 원본의 sync는 멱등이며 기존 파일 timestamp를 갱신하지 않는다", (testContext) => {
	const fixtureRoot = createSourceFixture(testContext);
	syncAgentDefinitions(fixtureRoot);
	utimesSync(generatedPath(fixtureRoot), new Date(0), new Date(0));
	const before = generatedSnapshot(fixtureRoot);
	assert.deepEqual(syncAgentDefinitions(fixtureRoot).writtenPaths, []);
	assert.deepEqual(generatedSnapshot(fixtureRoot), before);
});

test("원본을 바꾸면 check가 drift를 발견하고 명시적 재생성만 대상 파일을 갱신한다", (testContext) => {
	const fixtureRoot = createSourceFixture(testContext);
	syncAgentDefinitions(fixtureRoot);
	rewriteSource(sourcePath(fixtureRoot), (source) =>
		source
			.replace("fixture 0입니다.", "수정한 설명입니다.")
			.replace("## 역할·수정 범위", "## 역할·수정 범위\n수정된 업무 규칙"),
	);
	const before = generatedSnapshot(fixtureRoot);
	const check = checkAgentDefinitionSync(fixtureRoot);
	assert.equal(check.driftPaths.length, 1);
	assert.match(check.errors[0], /\.codex\/agents\/fixture-agent-0\.toml/);
	assert.match(check.errors[0], /pnpm agents:sync/);
	assert.deepEqual(generatedSnapshot(fixtureRoot), before);
	assert.deepEqual(syncAgentDefinitions(fixtureRoot).writtenPaths, [
		".zcode/agents/fixture-agent-0.md",
	]);
	assert.deepEqual(checkAgentDefinitionSync(fixtureRoot).errors, []);
});

test("생성본 직접 편집은 check로 감지하며 자동 수정하지 않는다", (testContext) => {
	const fixtureRoot = createSourceFixture(testContext);
	syncAgentDefinitions(fixtureRoot);
	rewriteSource(generatedPath(fixtureRoot), (source) =>
		source.replace("## 역할·수정 범위", "## 직접 편집한 내용"),
	);
	const before = generatedSnapshot(fixtureRoot);
	assert.deepEqual(checkAgentDefinitionSync(fixtureRoot).driftPaths, [
		".zcode/agents/fixture-agent-0.md",
	]);
	assert.deepEqual(generatedSnapshot(fixtureRoot), before);
});

test("생성 안내만 지워도 expected output drift로 감지한다", (testContext) => {
	const fixtureRoot = createSourceFixture(testContext);
	syncAgentDefinitions(fixtureRoot);
	rewriteSource(generatedPath(fixtureRoot), (source) =>
		source.replace(/^# 자동 생성:.*\n/m, ""),
	);
	assert.equal(checkAgentDefinitionSync(fixtureRoot).driftPaths.length, 1);
});

test("생성본 앞의 UTF-8 BOM도 제거하거나 무시하지 않고 drift로 감지한다", (testContext) => {
	const fixtureRoot = createSourceFixture(testContext);
	syncAgentDefinitions(fixtureRoot);
	rewriteSource(generatedPath(fixtureRoot), (source) => `\ufeff${source}`);
	const before = generatedSnapshot(fixtureRoot);
	assert.deepEqual(checkAgentDefinitionSync(fixtureRoot).driftPaths, [
		".zcode/agents/fixture-agent-0.md",
	]);
	assert.deepEqual(generatedSnapshot(fixtureRoot), before);
});

test("누락된 생성본은 read-only check에서 실패하고 sync가 해당 파일만 만든다", (testContext) => {
	const fixtureRoot = createSourceFixture(testContext);
	syncAgentDefinitions(fixtureRoot);
	rmSync(generatedPath(fixtureRoot));
	const before = generatedSnapshot(fixtureRoot);
	assert.equal(checkAgentDefinitionSync(fixtureRoot).driftPaths.length, 1);
	assert.deepEqual(generatedSnapshot(fixtureRoot), before);
	assert.equal(syncAgentDefinitions(fixtureRoot).writtenPaths.length, 1);
});

test("잘못된 원본 하나가 있으면 생성 폴더와 부분 파일을 만들지 않는다", (testContext) => {
	const fixtureRoot = createSourceFixture(testContext);
	rewriteSource(sourcePath(fixtureRoot, AGENT_DEFINITION_COUNT - 1), (source) =>
		source.replace('model_reasoning_effort = "high"\n', ""),
	);
	const result = syncAgentDefinitions(fixtureRoot);
	assert.ok(
		result.errors.some((error) => error.includes("model_reasoning_effort")),
	);
	assert.deepEqual(result.writtenPaths, []);
	assert.equal(existsSync(join(fixtureRoot, ".zcode")), false);
});

test("기존 생성본이 있어도 invalid input에서 일부 파일을 덮어쓰지 않는다", (testContext) => {
	const fixtureRoot = createSourceFixture(testContext);
	syncAgentDefinitions(fixtureRoot);
	rewriteSource(sourcePath(fixtureRoot), (source) =>
		source.replace("## 역할·수정 범위", "## 갱신 대기"),
	);
	rewriteSource(sourcePath(fixtureRoot, AGENT_DEFINITION_COUNT - 1), (source) =>
		source.replace('model = "fixture-model"', "model = false"),
	);
	const before = generatedSnapshot(fixtureRoot);
	assert.equal(syncAgentDefinitions(fixtureRoot).writtenPaths.length, 0);
	assert.deepEqual(generatedSnapshot(fixtureRoot), before);
});

for (const [countCase, mutate] of [
	[
		"누락",
		(fixtureRoot) =>
			rmSync(sourcePath(fixtureRoot, AGENT_DEFINITION_COUNT - 1)),
	],
	[
		"초과",
		(fixtureRoot) =>
			writeFileSync(
				sourcePath(fixtureRoot, AGENT_DEFINITION_COUNT),
				codexFixtureSource(`fixture-agent-${AGENT_DEFINITION_COUNT}`),
			),
	],
]) {
	test(`원본 역할 ${countCase} 상태에서는 허용하지 않고 쓰지 않는다`, (testContext) => {
		const fixtureRoot = createSourceFixture(testContext);
		mutate(fixtureRoot);
		const result = syncAgentDefinitions(fixtureRoot);
		assert.ok(
			result.errors.some((error) =>
				error.includes(`원본은 ${AGENT_DEFINITION_COUNT}개`),
			),
		);
		assert.deepEqual(result.writtenPaths, []);
		assert.equal(existsSync(join(fixtureRoot, ".zcode")), false);
	});
}

test("추가 또는 stale 생성 정의를 보고하고 알 수 없는 파일을 삭제하지 않는다", (testContext) => {
	const fixtureRoot = createSourceFixture(testContext);
	syncAgentDefinitions(fixtureRoot);
	writeFileSync(
		join(fixtureRoot, ".zcode", "agents", "obsolete-role.md"),
		"사용자 파일\n",
	);
	writeFileSync(join(fixtureRoot, ".zcode", "agents", "README"), "생성 안내\n");
	const before = generatedSnapshot(fixtureRoot);
	assert.ok(
		checkAgentDefinitionSync(fixtureRoot).errors.some((error) =>
			error.includes("stale"),
		),
	);
	assert.equal(syncAgentDefinitions(fixtureRoot).writtenPaths.length, 0);
	assert.deepEqual(generatedSnapshot(fixtureRoot), before);
});

test("원본 파일명과 역할 name이 다르면 생성하지 않는다", (testContext) => {
	const fixtureRoot = createSourceFixture(testContext);
	rewriteSource(sourcePath(fixtureRoot), (source) =>
		source.replace('name = "fixture-agent-0"', 'name = "other-role"'),
	);
	assert.ok(
		syncAgentDefinitions(fixtureRoot).errors.some((error) =>
			error.includes("파일명과 name"),
		),
	);
	assert.equal(existsSync(join(fixtureRoot, ".zcode")), false);
});

test("유효하지 않은 UTF-8 원본을 대체 문자로 침묵 변환하지 않는다", (testContext) => {
	const fixtureRoot = createSourceFixture(testContext);
	writeFileSync(sourcePath(fixtureRoot), Buffer.from([0xc3, 0x28]));
	assert.throws(
		() => readAgentDefinitionSource(sourcePath(fixtureRoot)),
		/UTF-8/,
	);
	assert.ok(
		syncAgentDefinitions(fixtureRoot).errors.some((error) =>
			error.includes("UTF-8"),
		),
	);
	assert.equal(existsSync(join(fixtureRoot, ".zcode")), false);
});

test("CLI --check는 drift에서 nonzero와 원본·해결 안내를 반환하고 파일을 쓰지 않는다", (testContext) => {
	const fixtureRoot = createSourceFixture(testContext);
	const command = spawnSync(
		process.execPath,
		[syncScriptPath, "--check", "--root", fixtureRoot],
		{ encoding: "utf8" },
	);
	assert.equal(command.status, 1);
	assert.match(command.stderr, /\.codex\/agents\/fixture-agent-0\.toml/);
	assert.match(command.stderr, /pnpm agents:sync:check/);
	assert.equal(existsSync(join(fixtureRoot, ".zcode")), false);
});

test("CLI 명시적 sync는 생성 후 같은 check와 재실행에서 통과한다", (testContext) => {
	const fixtureRoot = createSourceFixture(testContext);
	const firstSync = spawnSync(
		process.execPath,
		[syncScriptPath, "--root", fixtureRoot],
		{ encoding: "utf8" },
	);
	assert.equal(firstSync.status, 0, firstSync.stderr);
	assert.ok(
		firstSync.stdout.includes(
			`${AGENT_DEFINITION_COUNT} definitions, ${AGENT_DEFINITION_COUNT} updated`,
		),
	);
	const before = generatedSnapshot(fixtureRoot);
	const readonlyCheck = spawnSync(
		process.execPath,
		[syncScriptPath, "--check", "--root", fixtureRoot],
		{ encoding: "utf8" },
	);
	assert.equal(readonlyCheck.status, 0, readonlyCheck.stderr);
	const secondSync = spawnSync(
		process.execPath,
		[syncScriptPath, "--root", fixtureRoot],
		{ encoding: "utf8" },
	);
	assert.equal(secondSync.status, 0, secondSync.stderr);
	assert.match(secondSync.stdout, /0 updated/);
	assert.deepEqual(generatedSnapshot(fixtureRoot), before);
});

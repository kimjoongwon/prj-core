import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const read = (path) => readFileSync(path, "utf8");
const rel = (path) => relative(root, path);
const AGENT_COUNT = 37;

function walk(dir, predicate) {
	if (!existsSync(dir)) return [];
	const result = [];
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry);
		const stat = statSync(path);
		if (stat.isDirectory()) result.push(...walk(path, predicate));
		else if (predicate(path)) result.push(path);
	}
	return result;
}

function field(source, name) {
	return source.match(new RegExp("^" + name + '\\s*=\\s*"([^"]+)"', "m"))?.[1];
}

function instructions(source) {
	return source.match(/developer_instructions\s*=\s*'''?\r?\n([\s\S]*?)\r?\n'''/)?.[1];
}

function headingCount(source, heading) {
	return source.split(/\r?\n/).filter((line) => line.trim() === heading).length;
}

// ── 스킬 디렉터리는 완전히 제거되어야 한다 ──
if (existsSync(join(root, ".agents"))) {
	errors.push(".agents/: 스킬 디렉터리가 존재해서는 안 됩니다. 역할 지시문은 에이전트 정의에 인라인되어야 합니다.");
}

// ── Codex 정의(.codex/agents/*.toml) ──
const agentFiles = walk(join(root, ".codex", "agents"), (path) => path.endsWith(".toml"));
const agentNames = new Set();
const descriptions = new Set();

if (agentFiles.length !== AGENT_COUNT) {
	errors.push("custom agent는 " + AGENT_COUNT + "개여야 합니다. 현재 " + agentFiles.length + "개입니다.");
}

const forbidden = [/next\s+subagent/i, /handoff\s+key/i, /none-final/i, /none-blocked/i];

for (const path of agentFiles) {
	const source = read(path);
	const name = field(source, "name");
	const description = field(source, "description");
	const model = field(source, "model");
	const effort = field(source, "model_reasoning_effort");
	const body = instructions(source);

	if (/^\d{2}-/.test(basename(path))) errors.push(rel(path) + ": 숫자 접두사를 사용할 수 없습니다.");
	if (!name) errors.push(rel(path) + ": name 필드가 없습니다.");
	if (!description) errors.push(rel(path) + ": description 필드가 없습니다.");
	if (!model) errors.push(rel(path) + ": model 필드가 없습니다.");
	if (!effort) errors.push(rel(path) + ": model_reasoning_effort 필드가 없습니다.");
	if (!body) errors.push(rel(path) + ": developer_instructions 필드가 없습니다.");
	if (name === "orch-delivery") errors.push(rel(path) + ": orch-delivery는 custom agent가 될 수 없습니다.");
	if (name && basename(path, ".toml") !== name) {
		errors.push(rel(path) + ': 파일명은 name 필드 "' + name + '"와 일치해야 합니다.');
	}
	if (name && agentNames.has(name)) errors.push(rel(path) + ': 중복 agent name "' + name + '"입니다.');
	if (name) agentNames.add(name);

	if (description && description.length > 160) {
		errors.push(rel(path) + ": description은 라우팅용으로 160자 이하여야 합니다.");
	}
	if (description && descriptions.has(description)) {
		errors.push(rel(path) + ": 다른 agent와 description이 중복됩니다.");
	}
	if (description) descriptions.add(description);

	if (!body) continue;

	// 자가완결: 정의문 밖 지침 파일 참조 금지
	if (/\.agents\/skills|SKILL\.md/i.test(body)) {
		errors.push(rel(path) + ": 정의문이 외부 스킬 파일을 참조합니다. 역할 지시문을 정의문 안에 인라인해야 합니다.");
	}
	if (/\bskill\b|스킬/i.test(body)) {
		errors.push(rel(path) + ": 정의문에 스킬 참조 표현이 남아 있습니다.");
	}

	for (const pattern of forbidden) {
		if (pattern.test(body)) {
			errors.push(rel(path) + ': 이전 orchestration 표현 "' + pattern.source + '"이 남아 있습니다.');
		}
	}
	if (/\.spec\.md/.test(body)) errors.push(rel(path) + ": 삭제된 *.spec.md 참조가 남아 있습니다.");

	for (const heading of [
		"## 입력 계약",
		"### 요청에서 확인할 정보",
		"### 저장소에서 직접 찾을 정보",
		"### 구현 전 필수 조건",
		"### 입력 필요 조건",
		"## 단독 실행 계약",
	]) {
		if (headingCount(body, heading) !== 1) {
			errors.push(rel(path) + ': "' + heading + '"은 정확히 하나여야 합니다.');
		}
	}

	for (const line of body.split(/\r?\n/)) {
		const directsWorker = /(다른|다음|후속).{0,30}(custom agent|subagent|에이전트).{0,20}(호출|실행|선택)/i.test(
			line,
		);
		if (directsWorker && !/(않|금지)/.test(line)) {
			errors.push(rel(path) + ": worker 간 실행 지시가 남아 있습니다: " + line.trim());
		}
	}
}

// ── ZCode 정의(.zcode/agents/*.md)와 Codex 정의 동기화 ──
const zcodeFiles = walk(join(root, ".zcode", "agents"), (path) => /\.md$/.test(path) && basename(path) !== "README");
const zcodeNames = new Set();

if (zcodeFiles.length !== AGENT_COUNT) {
	errors.push(".zcode/agents 정의는 " + AGENT_COUNT + "개여야 합니다. 현재 " + zcodeFiles.length + "개입니다.");
}

for (const path of zcodeFiles) {
	const source = read(path);
	const name = source.match(/^name:\s*(.+)$/m)?.[1]?.trim();
	const description = source.match(/^description:\s*"(.+)"$/m)?.[1];
	const body = source.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n\r?\n([\s\S]*)$/)?.[1];

	if (!name || !description || body === undefined) {
		errors.push(rel(path) + ": frontmatter(name, description)와 본문이 모두 있어야 합니다.");
		continue;
	}
	if (basename(path, ".md") !== name) {
		errors.push(rel(path) + ': 파일명은 name 필드 "' + name + '"과 일치해야 합니다.');
	}
	if (zcodeNames.has(name)) errors.push(rel(path) + ': 중복 agent name "' + name + '"입니다.');
	if (name) zcodeNames.add(name);

	const frontmatterBlock = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
	const frontmatterKeys = frontmatterBlock
		.split(/\r?\n/)
		.filter((line) => line.trim())
		.map((line) => line.slice(0, line.indexOf(":")).trim());
	for (const key of frontmatterKeys) {
		if (!["name", "description"].includes(key)) {
			errors.push(rel(path) + ': 허용되지 않은 frontmatter 필드 "' + key + '"입니다.');
		}
	}

	const tomlPath = join(root, ".codex", "agents", name + ".toml");
	if (!existsSync(tomlPath)) {
		errors.push(rel(path) + ": 대응하는 .codex/agents/" + name + ".toml이 없습니다.");
		continue;
	}
	const tomlBody = instructions(read(tomlPath));
	const tomlDescription = field(read(tomlPath), "description");
	if (body.replace(/\n$/, "") !== tomlBody) {
		errors.push(rel(path) + ": 본문이 .codex/agents/" + name + ".toml의 developer_instructions와 다릅니다.");
	}
	if (description !== tomlDescription) {
		errors.push(rel(path) + ": description이 .codex/agents/" + name + ".toml과 다릅니다.");
	}
}

const missingInZcode = [...agentNames].filter((name) => !zcodeNames.has(name));
const missingInCodex = [...zcodeNames].filter((name) => !agentNames.has(name));
for (const name of missingInZcode) errors.push(".zcode/agents/" + name + ".md: 대응 정의가 없습니다.");
for (const name of missingInCodex) errors.push(".codex/agents/" + name + ".toml: 대응 정의가 없습니다.");

// ── Codex 설정 ──
const codexConfig = read(join(root, ".codex", "config.toml"));
if (!/^max_concurrent_threads_per_session\s*=\s*8\s*$/m.test(codexConfig)) {
	errors.push(".codex/config.toml: agents.max_concurrent_threads_per_session = 8 설정이 필요합니다.");
}
if (/^max_threads\s*=/m.test(codexConfig)) {
	errors.push(".codex/config.toml: legacy agents.max_threads를 사용할 수 없습니다.");
}

// ── 루트 계약(AGENTS.md) ──
const rootContract = read(join(root, "AGENTS.md"));
for (const heading of [
	"## 작업 결과",
	"## 작업 요약",
	"## 변경 산출물",
	"## 수행한 검증",
	"## 남은 문제",
]) {
	if (!rootContract.includes("`" + heading + "`")) {
		errors.push("AGENTS.md: Worker 최종 보고 계약 " + heading + "이 없습니다.");
	}
}
if (/COMMON\.md/.test(rootContract)) {
	errors.push("AGENTS.md: 존재하지 않는 COMMON.md를 참조할 수 없습니다.");
}
if (/SKILL\.md|\.agents\/skills|스킬/.test(rootContract)) {
	errors.push("AGENTS.md: 스킬 체계 참조가 남아 있습니다.");
}
for (const required of [
	"독립적인 write 작업은 기본 최대 4개",
	"결과 capsule",
	"재작업은 같은 owner에게",
	"루트 세션",
]) {
	if (!rootContract.includes(required)) {
		errors.push('AGENTS.md: 루트 조율 필수 계약 "' + required + '"이 없습니다.');
	}
}

// ── logging-only Hook ──
const hooksPath = join(root, ".codex", "hooks.json");
if (!existsSync(hooksPath)) {
	errors.push(".codex/hooks.json: logging-only Hook 설정이 없습니다.");
} else {
	try {
		const hooksConfig = JSON.parse(read(hooksPath));
		const expected = [
			"UserPromptSubmit",
			"PreToolUse",
			"PostToolUse",
			"SubagentStart",
			"SubagentStop",
			"Stop",
		];
		const actual = Object.keys(hooksConfig.hooks ?? {}).sort();
		if (actual.join(",") !== [...expected].sort().join(",")) {
			errors.push(".codex/hooks.json: 허용된 Agent 경계 이벤트만 설정해야 합니다.");
		}
		for (const event of expected) {
			const groups = hooksConfig.hooks?.[event];
			if (!Array.isArray(groups) || groups.length !== 1) {
				errors.push(".codex/hooks.json: " + event + " matcher group은 정확히 하나여야 합니다.");
				continue;
			}
			if (["PreToolUse", "PostToolUse"].includes(event) && groups[0].matcher !== "^Agent$") {
				errors.push(".codex/hooks.json: " + event + " matcher는 ^Agent$여야 합니다.");
			}
			const handlers = groups[0].hooks;
			if (!Array.isArray(handlers) || handlers.length !== 1) {
				errors.push(".codex/hooks.json: " + event + " command handler는 정확히 하나여야 합니다.");
				continue;
			}
			const handler = handlers[0];
			if (handler.type !== "command" || !handler.command?.includes("log-subagent-event.mjs")) {
				errors.push(".codex/hooks.json: " + event + "는 공통 raw logger를 사용해야 합니다.");
			}
			if (!handler.command?.endsWith(" " + event)) {
				errors.push(".codex/hooks.json: " + event + " 이름을 logger에 전달해야 합니다.");
			}
		}
	} catch (error) {
		errors.push(".codex/hooks.json: JSON 파싱 실패: " + error.message);
	}
}

const loggerPath = join(root, "scripts", "log-subagent-event.mjs");
if (!existsSync(loggerPath)) {
	errors.push("scripts/log-subagent-event.mjs: raw logger가 없습니다.");
} else {
	const logger = read(loggerPath);
	if (/(permissionDecision|additionalContext|decision\s*:|continue\s*:)/.test(logger)) {
		errors.push("scripts/log-subagent-event.mjs: logger는 실행 제어 출력을 만들 수 없습니다.");
	}
}

const ignore = read(join(root, ".gitignore"));
if (!/^\.codex\/logs\/$/m.test(ignore)) {
	errors.push(".gitignore: .codex/logs/ 제외 규칙이 없습니다.");
}

// ── 삭제된 체계의 잔여 참조 ──
const stalePaths = [
	...walk(join(root, "docs"), (path) => path.endsWith(".md")),
	join(root, "apps", "mobile", "src", "app", "app.context.md"),
	join(root, "package.json"),
];
for (const path of stalePaths) {
	if (existsSync(path) && /\.spec\.md/.test(read(path))) {
		errors.push(rel(path) + ": 삭제된 *.spec.md 참조가 남아 있습니다.");
	}
}
for (const file of ["spec-audit.js", "spec-generate.js", "check-mobile-screen-targets.mjs"]) {
	if (existsSync(join(root, "scripts", file))) {
		errors.push("scripts/" + file + ": 삭제된 spec 체계의 script가 남아 있습니다.");
	}
}

const packageJson = JSON.parse(read(join(root, "package.json")));
if (packageJson.scripts["agents:contracts:check"] !== "node scripts/check-agent-contracts.mjs") {
	errors.push("package.json: agents:contracts:check 명령이 없습니다.");
}
if (packageJson.scripts["agents:flow:test"] !== "node scripts/test-subagent-log-hook.mjs") {
	errors.push("package.json: agents:flow:test 명령이 없습니다.");
}
for (const name of Object.keys(packageJson.scripts)) {
	if (name.startsWith("spec:") || name === "mobile:screen-targets:check") {
		errors.push('package.json: 제거 대상 script "' + name + '"이 남아 있습니다.');
	}
}

if (errors.length) {
	console.error("Agent contract check failed:\n");
	for (const error of errors) console.error("- " + error);
	process.exit(1);
}

console.log(
	"Agent contract check passed: " +
		agentFiles.length +
		" self-contained agents (codex toml + zcode md sync), logging-only Hooks.",
);

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const read = (path) => readFileSync(path, "utf8");
const rel = (path) => relative(root, path);

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

function headingCount(source, heading) {
	return source.split(/\r?\n/).filter((line) => line.trim() === heading).length;
}

const agentFiles = walk(join(root, ".codex", "agents"), (path) => path.endsWith(".toml"));
const agentNames = new Set();
const descriptions = new Set();
const skillOwners = new Map();

if (agentFiles.length !== 39) {
	errors.push("custom agent는 39개여야 합니다. 현재 " + agentFiles.length + "개입니다.");
}

for (const path of agentFiles) {
	const source = read(path);
	const name = field(source, "name");
	const description = field(source, "description");
	const model = field(source, "model");

	if (/^\d{2}-/.test(basename(path))) errors.push(rel(path) + ": 숫자 접두사를 사용할 수 없습니다.");
	if (!name) errors.push(rel(path) + ": name 필드가 없습니다.");
	if (!description) errors.push(rel(path) + ": description 필드가 없습니다.");
	if (!model) errors.push(rel(path) + ": model 필드가 없습니다.");
	if (!/^developer_instructions\s*=\s*(?:"""|''')/m.test(source)) {
		errors.push(rel(path) + ": developer_instructions 필드가 없습니다.");
	}
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

	const refs = [
		...new Set(
			[...source.matchAll(/\.agents\/skills\/[a-z0-9-]+\/SKILL\.md/g)].map(
				(match) => match[0],
			),
		),
	];
	if (refs.length !== 1) errors.push(rel(path) + ": repository skill 경로는 정확히 하나여야 합니다.");
	for (const ref of refs) {
		if (!existsSync(join(root, ref))) errors.push(rel(path) + ": skill 경로가 존재하지 않습니다: " + ref);
		const skillName = ref.split("/").at(-2);
		const owners = skillOwners.get(skillName) ?? [];
		owners.push(name);
		skillOwners.set(skillName, owners);
	}
}

const codexConfig = read(join(root, ".codex", "config.toml"));
if (!/^max_concurrent_threads_per_session\s*=\s*8\s*$/m.test(codexConfig)) {
	errors.push(".codex/config.toml: agents.max_concurrent_threads_per_session = 8 설정이 필요합니다.");
}
if (/^max_threads\s*=/m.test(codexConfig)) {
	errors.push(".codex/config.toml: legacy agents.max_threads를 사용할 수 없습니다.");
}

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
if (!rootContract.includes("독립적인 write 작업은 기본 최대 4개")) {
	errors.push("AGENTS.md: write worker 병렬 상한 계약이 없습니다.");
}

const forbidden = [/next\s+subagent/i, /handoff\s+key/i, /none-final/i, /none-blocked/i];
const skillFiles = walk(join(root, ".agents", "skills"), (path) => path.endsWith("SKILL.md"));
const workerSkills = skillFiles.filter((path) => basename(dirname(path)) !== "orch-delivery");

if (skillFiles.length !== 37) {
	errors.push("skill은 orch-delivery 포함 37개여야 합니다. 현재 " + skillFiles.length + "개입니다.");
}
if (workerSkills.length !== 36) {
	errors.push("worker skill은 36개여야 합니다. 현재 " + workerSkills.length + "개입니다.");
}

for (const path of skillFiles) {
	const source = read(path);
	const isOrchestrator = basename(dirname(path)) === "orch-delivery";
	const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!frontmatter) {
		errors.push(rel(path) + ": YAML frontmatter가 없습니다.");
	} else {
		const entries = frontmatter[1]
			.split(/\r?\n/)
			.filter((line) => line.trim())
			.map((line) => {
				const separator = line.indexOf(":");
				return separator < 0
					? [line.trim(), ""]
					: [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
			});
		const metadata = new Map(entries);
		const skillName = metadata.get("name")?.replace(/^["']|["']$/g, "");
		if (!skillName) errors.push(rel(path) + ": skill name이 없습니다.");
		if (!metadata.get("description")) errors.push(rel(path) + ": skill description이 없습니다.");
		for (const [key] of entries) {
			if (!["name", "description"].includes(key)) {
				errors.push(rel(path) + ': 허용되지 않은 frontmatter 필드 "' + key + '"입니다.');
			}
		}
		if (skillName && skillName !== basename(dirname(path))) {
			errors.push(rel(path) + ": skill name은 폴더명과 일치해야 합니다.");
		}
	}

	for (const pattern of forbidden) {
		if (pattern.test(source)) {
			errors.push(rel(path) + ': 이전 orchestration 표현 "' + pattern.source + '"이 남아 있습니다.');
		}
	}
	if (/\.spec\.md/.test(source)) errors.push(rel(path) + ": 삭제된 *.spec.md 참조가 남아 있습니다.");

	if (!isOrchestrator) {
		for (const heading of [
			"## 입력 계약",
			"### 요청에서 확인할 정보",
			"### 저장소에서 직접 찾을 정보",
			"### 구현 전 필수 조건",
			"### 입력 필요 조건",
			"## 단독 실행 계약",
		]) {
			if (headingCount(source, heading) !== 1) {
				errors.push(rel(path) + ': "' + heading + '"은 정확히 하나여야 합니다.');
			}
		}
		for (const line of source.split(/\r?\n/)) {
			const directsWorker = /(다른|다음|후속).{0,30}(custom agent|subagent|에이전트).{0,20}(호출|실행|선택)/i.test(
				line,
			);
			if (directsWorker && !/(않|금지)/.test(line)) {
				errors.push(rel(path) + ": worker 간 실행 지시가 남아 있습니다: " + line.trim());
			}
		}
	}
}

for (const [skillName, owners] of skillOwners) {
	if (owners.length < 2) continue;
	const source = read(join(root, ".agents", "skills", skillName, "SKILL.md"));
	for (const owner of owners) {
		if (!source.includes(owner)) {
			errors.push(".agents/skills/" + skillName + '/SKILL.md: 공유 역할 "' + owner + '" 구분이 없습니다.');
		}
	}
}

const orchestrator = read(join(root, ".agents", "skills", "orch-delivery", "SKILL.md"));
for (const pattern of [/실행 원장/, /prompt renderer/i, /custom DAG/i, /spec 갱신/i, /승인된 spec/i]) {
	if (pattern.test(orchestrator)) {
		errors.push('.agents/skills/orch-delivery/SKILL.md: 제거 대상 표현 "' + pattern.source + '"이 남아 있습니다.');
	}
}
for (const required of ["기본 최대 4개", "모든 결과를 기다립니다", "결과 capsule"]) {
	if (!orchestrator.includes(required)) {
		errors.push('.agents/skills/orch-delivery/SKILL.md: 필수 조율 계약 "' + required + '"이 없습니다.');
	}
}

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

const stalePaths = [
	...skillFiles,
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
		" agents, " +
		workerSkills.length +
		" worker skills, logging-only Hooks.",
);

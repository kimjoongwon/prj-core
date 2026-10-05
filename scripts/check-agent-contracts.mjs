import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
	AGENT_DEFINITION_COUNT,
	parseCodexAgentDefinition,
	parseZcodeAgentDefinition,
	readAgentDefinitionSource,
} from "./agent-definition-format.mjs";
import { checkAgentDefinitionSync } from "./sync-agent-definitions.mjs";

const checkerPath = fileURLToPath(import.meta.url);
const repositoryRoot = resolve(dirname(checkerPath), "..");
const AGENT_COUNT = AGENT_DEFINITION_COUNT;
const AGENT_BUILDER_NAME = "etc-agent-builder";
const FEEDBACK_REQUIRED_STATEMENTS = [
	"사용자 피드백을 문제의 이유·의도·적용 조건·판단 기준으로 정리합니다.",
	"특정 표현이 거부되었다는 사실만으로 이름 블랙리스트나 근거 없는 범용 금지를 만들지 않습니다.",
	"사용자가 정확한 식별자·문구·한 작업에만 적용할 지시를 명시하면 해당 표기와 범위를 보존합니다.",
	"피드백의 의미·이유·적용 조건을 요청과 기존 코드·계약에서 확인할 수 없으면 추측하여 일반화하지 않고 사용자에게 확인합니다.",
];
const FEEDBACK_REQUIRED_RULES = [
	[
		"실제 영향을 받는 정의의 필요한 계약만 수정",
		/(?:실제|직접) 영향을 받는 (?:정의|역할)의 필요한 (?:실행 )?계약만 (?:맞춥니다|변경합니다|수정합니다)\./,
	],
	[
		"기존 지시 재사용·통합과 중복 제거",
		/기존 (?:지시를|규칙을) 재사용[·/]통합하고 중복[^\n]*(?:제거|정리)합니다\./,
	],
	[
		"원래 사례·다른 도메인·허용 및 예외 사례 교차 검토",
		/원래 사례[^\n]*다른 도메인의 적용 사례[^\n]*허용[·/]예외 사례에서 (?:검토|확인)하여/,
	],
];
const TOP_LEVEL_HEADINGS = [
	"## 역할·수정 범위",
	"## 입력 계약",
	"## 기술 규칙",
	"## 단독 실행 계약",
	"## 생성·리뷰·수정",
	"## 검증·보고",
];
const INPUT_HEADINGS = [
	"### 요청에서 확인할 정보",
	"### 저장소에서 직접 찾을 정보",
	"### 구현 전 필수 조건",
	"### 입력 필요 조건",
];
const EXECUTION_HEADINGS = [
	"### 담당 단계",
	"### 하위 단계",
	"### 작업 전달과 결과 수집",
];
const REPORT_HEADINGS = [
	"## 작업 결과",
	"## 작업 요약",
	"## 변경 산출물",
	"## 수행한 검증",
	"## 남은 문제",
];
const REQUIRED_STATEMENTS = [
	["### 담당 단계", "호출 단계가 지정되지 않으면 담당 단계로 실행합니다."],
	[
		"### 담당 단계",
		"필요한 하위 역할은 사용자가 지정하지 않아도 name과 description으로 선택합니다.",
	],
	[
		"### 담당 단계",
		"필요한 다른 역할의 산출물은 해당 하위 에이전트에 생성·수정을 맡깁니다.",
	],
	[
		"### 담당 단계",
		"하위의 선행 입력이 부족하면 필요한 다른 하위를 먼저 실행하고, 산출물 요약을 전달하여 원래 하위를 재개합니다.",
	],
	["### 하위 단계", "호출 깊이는 루트 → 담당 → 하위까지입니다."],
	[
		"### 하위 단계",
		"하위로 받은 작업에서는 다른 에이전트를 호출하지 않습니다.",
	],
	["### 하위 단계", "하위 요청에는 `호출 단계: 하위`를 반드시 포함합니다."],
	[
		"### 작업 전달과 결과 수집",
		"하위 요청에 목표, 수정 범위, 사용자 결정, 선행 산출물, 완료 기준과 동시 실행 예산을 전달합니다.",
	],
	[
		"### 작업 전달과 결과 수집",
		"부모의 전체 대화나 지시문을 전달하거나 안다고 가정하지 않습니다.",
	],
	[
		"### 작업 전달과 결과 수집",
		"배정받은 수정 범위와 동시 실행 예산 안에서만 위임하고, 같은 파일·공개 export의 수정은 직렬로 실행합니다.",
	],
	[
		"### 작업 전달과 결과 수집",
		"전체 작업 트리에서 동시 write는 최대 4개, read-only는 최대 8개이며 부모의 직접 작업도 포함합니다.",
	],
	[
		"### 작업 전달과 결과 수집",
		"하위의 최종 보고, 산출물 경로, 공개 계약과 검증 결과를 확인하고, 필수 하위 결과가 모두 완료일 때만 연결합니다.",
	],
	[
		"## 생성·리뷰·수정",
		"기존 산출물과 사용처를 확인하고 재사용한 뒤 새 산출물을 생성하거나 기존 산출물을 수정합니다.",
	],
	[
		"## 생성·리뷰·수정",
		"생성·수정 과정에서 역할 규칙, 공개 계약과 사용처를 리뷰하고, 자기 역할 범위의 위반을 직접 고칩니다.",
	],
	["## 생성·리뷰·수정", "자기 역할 밖의 파일은 직접 수정하지 않습니다."],
	[
		"## 생성·리뷰·수정",
		"하위 산출물의 규칙 위반이나 검증 실패는 같은 담당 에이전트에 핵심 오류와 재현 명령을 전달하여 수정·재검증합니다.",
	],
];

function collectContractFiles(directoryPath, acceptsPath) {
	if (!existsSync(directoryPath)) return [];
	const contractPaths = [];
	for (const entryName of readdirSync(directoryPath).sort()) {
		const entryPath = join(directoryPath, entryName);
		if (statSync(entryPath).isDirectory()) {
			contractPaths.push(...collectContractFiles(entryPath, acceptsPath));
		} else if (acceptsPath(entryPath)) {
			contractPaths.push(entryPath);
		}
	}
	return contractPaths;
}

// 보고 템플릿의 코드 블록은 정의문 절 구조로 세지 않습니다.
function collectMarkdownHeadings(source) {
	const sourceLines = source.split(/\r?\n/);
	const headings = [];
	let fenceMarker;
	for (const [lineIndex, sourceLine] of sourceLines.entries()) {
		const fence = sourceLine.match(/^\s*(`{3,}|~{3,})/);
		if (fence) {
			if (!fenceMarker) fenceMarker = fence[1][0];
			else if (fence[1][0] === fenceMarker) fenceMarker = undefined;
			continue;
		}
		if (fenceMarker) continue;
		const heading = sourceLine.match(/^(#{2,3})\s+(.+?)\s*$/);
		if (heading)
			headings.push({
				text: `${heading[1]} ${heading[2]}`,
				level: heading[1].length,
				lineIndex,
			});
	}
	return { sourceLines, headings };
}

function readMarkdownSection(source, headingText) {
	const { sourceLines, headings } = collectMarkdownHeadings(source);
	const headingIndex = headings.findIndex(
		(heading) => heading.text === headingText,
	);
	if (headingIndex < 0) return "";
	const heading = headings[headingIndex];
	const nextHeading = headings
		.slice(headingIndex + 1)
		.find((candidate) => candidate.level <= heading.level);
	return sourceLines
		.slice(heading.lineIndex + 1, nextHeading?.lineIndex ?? sourceLines.length)
		.join("\n");
}

function collectContractStatementLines(sectionBody) {
	const contractStatements = [];
	let fenceMarker;
	for (const sourceLine of sectionBody
		.replace(/<!--[\s\S]*?-->/g, "")
		.split(/\r?\n/)) {
		const fence = sourceLine.match(/^\s*(`{3,}|~{3,})/);
		if (fence) {
			if (!fenceMarker) fenceMarker = fence[1][0];
			else if (fence[1][0] === fenceMarker) fenceMarker = undefined;
			continue;
		}
		if (fenceMarker || /^\s*(?:>|#{1,6}\s)/.test(sourceLine)) continue;
		contractStatements.push(sourceLine.trim().replace(/^[-*+]\s+/, ""));
	}
	return contractStatements;
}

// 신규 역할의 정적 텍스트 계약만 보호하며 실제 모델 행동을 검증하지 않습니다.
function validateAgentFeedbackContracts(agentBody, definitionPath) {
	const contractStatements = collectContractStatementLines(
		readMarkdownSection(agentBody, "## 기술 규칙"),
	);
	const errors = [];
	for (const requiredStatement of FEEDBACK_REQUIRED_STATEMENTS) {
		if (!contractStatements.includes(requiredStatement))
			errors.push(
				`${definitionPath}: ## 기술 규칙의 피드백 필수 계약이 없습니다: ${requiredStatement}`,
			);
	}
	for (const [ruleName, requiredPattern] of FEEDBACK_REQUIRED_RULES) {
		if (
			!contractStatements.some((statement) => requiredPattern.test(statement))
		)
			errors.push(
				`${definitionPath}: ## 기술 규칙의 피드백 필수 계약이 없습니다: ${ruleName}`,
			);
	}
	return errors;
}

function validateHeadingSequence(
	source,
	expectedHeadings,
	level,
	errors,
	definitionPath,
) {
	const actualHeadings = collectMarkdownHeadings(source)
		.headings.filter((heading) => heading.level === level)
		.map((heading) => heading.text);
	for (const headingText of expectedHeadings) {
		if (
			actualHeadings.filter((heading) => heading === headingText).length !== 1
		) {
			errors.push(
				`${definitionPath}: "${headingText}"은 정확히 하나여야 합니다.`,
			);
		}
	}
	if (actualHeadings.join("\n") !== expectedHeadings.join("\n")) {
		errors.push(
			`${definitionPath}: 절 구조와 순서가 다릅니다. 기대: ${expectedHeadings.join(", ")}`,
		);
	}
}

export function validateAgentInstructions(
	agentBody,
	definitionPath = "agent",
	agentName,
) {
	const errors = [];
	if (agentName === AGENT_BUILDER_NAME)
		errors.push(...validateAgentFeedbackContracts(agentBody, definitionPath));
	validateHeadingSequence(
		agentBody,
		TOP_LEVEL_HEADINGS,
		2,
		errors,
		definitionPath,
	);
	validateHeadingSequence(
		readMarkdownSection(agentBody, "## 입력 계약"),
		INPUT_HEADINGS,
		3,
		errors,
		definitionPath,
	);
	validateHeadingSequence(
		readMarkdownSection(agentBody, "## 단독 실행 계약"),
		EXECUTION_HEADINGS,
		3,
		errors,
		definitionPath,
	);

	for (const [headingText, requiredStatement] of REQUIRED_STATEMENTS) {
		if (
			!readMarkdownSection(agentBody, headingText).includes(requiredStatement)
		) {
			errors.push(
				`${definitionPath}: ${headingText}의 필수 계약이 없습니다: ${requiredStatement}`,
			);
		}
	}

	if (/\.agents\/skills|SKILL\.md|\bskill\b|스킬/i.test(agentBody)) {
		errors.push(`${definitionPath}: 외부 역할 지침 참조 표현이 남아 있습니다.`);
	}
	for (const legacyPattern of [
		/handoff\s+key/i,
		/none-final/i,
		/none-blocked/i,
		/\.spec\.md/,
	]) {
		if (legacyPattern.test(agentBody)) {
			errors.push(
				`${definitionPath}: 이전 orchestration 표현 "${legacyPattern.source}"이 남아 있습니다.`,
			);
		}
	}

	let isLowerStage = false;
	for (const sourceLine of agentBody.split(/\r?\n/)) {
		if (/^#{2,3}\s/.test(sourceLine))
			isLowerStage = sourceLine === "### 하위 단계";
		const bansDelegation =
			/(다른|다음|후속).*(custom agent|subagent|에이전트|worker).*(호출|실행|선택).*(않|금지)/i.test(
				sourceLine,
			);
		const hasScopeCondition =
			/하위로 받은 작업|하위 단계에서는?|하위(?: 에이전트)?는|호출 단계.*하위|사용자.*(?:금지|제한)|호출 제한|read-only/.test(
				sourceLine,
			);
		const bansResponsibleStage = /담당(?:은| 에이전트)/.test(sourceLine);
		if (
			bansDelegation &&
			(!isLowerStage || bansResponsibleStage) &&
			!hasScopeCondition
		) {
			errors.push(
				`${definitionPath}: 무조건 위임 금지 계약이 남아 있습니다: ${sourceLine.trim()}`,
			);
		}
	}

	const inputRequiredBody = readMarkdownSection(
		agentBody,
		"### 입력 필요 조건",
	);
	if (
		!/확보(?:할 수 있는| 가능한)[^\n]*(?:입력|선행)[^\n]*(?:종료하지|멈추지)/.test(
			inputRequiredBody,
		)
	) {
		errors.push(
			`${definitionPath}: 담당의 확보 가능한 입력 부족으로 종료하지 않는 계약이 없습니다.`,
		);
	}

	const reportBody = readMarkdownSection(agentBody, "## 검증·보고");
	for (const headingText of REPORT_HEADINGS) {
		if (reportBody.split(headingText).length - 1 !== 1) {
			errors.push(
				`${definitionPath}: 검증·보고의 최종 보고 항목 "${headingText}"은 정확히 하나여야 합니다.`,
			);
		}
	}
	for (const statusName of ["완료", "입력 필요", "검증 실패"]) {
		if (!reportBody.includes(statusName))
			errors.push(
				`${definitionPath}: 검증·보고의 작업 결과 "${statusName}"이 없습니다.`,
			);
	}
	for (const completionCondition of ["산출물", "기본 검증", "추가 완료 기준"]) {
		if (!reportBody.includes(completionCondition)) {
			errors.push(
				`${definitionPath}: 완료 판정의 "${completionCondition}" 조건이 없습니다.`,
			);
		}
	}
	const hasCompletionCriteria = reportBody
		.split(/\r?\n/)
		.some(
			(sourceLine) =>
				sourceLine.includes("기본 검증") &&
				sourceLine.includes("추가 완료 기준") &&
				/(?:충족(?:해야|한|했|하고|하여)|통과(?:하고|해야|한|했|하여))/.test(
					sourceLine,
				) &&
				/모든 필수 하위[^.\n]*완료/.test(sourceLine) &&
				/`완료`|(?:^|[-\s])완료(?:는|입니다)/.test(sourceLine),
		);
	if (!hasCompletionCriteria) {
		errors.push(
			`${definitionPath}: 기본 검증과 추가 완료 기준 통과 및 모든 필수 하위 완료를 요구하는 완료 판정 계약이 없습니다.`,
		);
	}
	if (
		!/입력 확인에서 멈춘 해당 작업[^.\n]*(?:변경[^.\n]{0,20}(?:없|하지 않)|변경 없이)/.test(
			inputRequiredBody,
		)
	) {
		errors.push(
			`${definitionPath}: 입력 확인에서 멈춘 해당 작업의 변경 없음 계약이 없습니다.`,
		);
	}
	if (
		!/(?:이미|앞서) 완료(?:된|한)[^.\n]*하위[^.\n]*산출물[^.\n]*보존(?:하고|하며|한|합니다)[^.\n]*경로[^.\n]*(?:보고|포함)/.test(
			inputRequiredBody,
		)
	) {
		errors.push(
			`${definitionPath}: 이미 완료된 하위 산출물 보존과 변경 경로 보고 계약이 없습니다.`,
		);
	}
	if (
		!/(?:런타임|runtime)[^\n]*(?:결과|완료)[^\n]*(?:분리|구분)/i.test(
			reportBody,
		)
	) {
		errors.push(
			`${definitionPath}: 런타임 완료 상태와 프로젝트 결과를 분리하는 계약이 없습니다.`,
		);
	}
	return errors;
}

export function validateAgentPair({
	codexSource,
	zcodeSource,
	codexPath = "agent.toml",
	zcodePath = "agent.md",
}) {
	const errors = [];
	let codexDefinition;
	let zcodeDefinition;
	try {
		codexDefinition = parseCodexAgentDefinition(codexSource, codexPath);
		zcodeDefinition = parseZcodeAgentDefinition(zcodeSource, zcodePath);
	} catch (error) {
		return [error.message];
	}
	if (basename(zcodePath, ".md") !== zcodeDefinition.name)
		errors.push(`${zcodePath}: 파일명은 name 필드와 일치해야 합니다.`);
	if (zcodeDefinition.name !== codexDefinition.name)
		errors.push(`${zcodePath}: name이 ${codexPath}과 다릅니다.`);
	if (zcodeDefinition.description !== codexDefinition.description)
		errors.push(`${zcodePath}: description이 ${codexPath}과 다릅니다.`);
	if (zcodeDefinition.instructions !== codexDefinition.instructions)
		errors.push(
			`${zcodePath}: 본문이 ${codexPath}의 developer_instructions와 다릅니다.`,
		);
	return errors;
}

export function checkAgentContracts(root = repositoryRoot) {
	const errors = [];
	const read = (path) => readFileSync(path, "utf8");
	const rel = (path) => relative(root, path);
	if (existsSync(join(root, ".agents"))) {
		errors.push(".agents/: 역할 지시문은 에이전트 정의에 인라인되어야 합니다.");
	}
	const agentFiles = collectContractFiles(
		join(root, ".codex", "agents"),
		(path) => path.endsWith(".toml"),
	);
	const agentNames = new Set();
	const descriptions = new Set();
	if (agentFiles.length !== AGENT_COUNT)
		errors.push(
			`custom agent는 ${AGENT_COUNT}개여야 합니다. 현재 ${agentFiles.length}개입니다.`,
		);
	for (const path of agentFiles) {
		let definition;
		try {
			definition = parseCodexAgentDefinition(
				readAgentDefinitionSource(path),
				rel(path),
			);
		} catch (error) {
			errors.push(error.message);
			continue;
		}
		const { name, description, instructions } = definition;
		if (/^\d{2}-/.test(basename(path)))
			errors.push(`${rel(path)}: 숫자 접두사를 사용할 수 없습니다.`);
		if (name === "orch-delivery")
			errors.push(
				`${rel(path)}: orch-delivery는 custom agent가 될 수 없습니다.`,
			);
		if (name && basename(path, ".toml") !== name)
			errors.push(
				`${rel(path)}: 파일명은 name 필드 "${name}"와 일치해야 합니다.`,
			);
		if (name && agentNames.has(name))
			errors.push(`${rel(path)}: 중복 agent name "${name}"입니다.`);
		if (name) agentNames.add(name);
		if (description && description.length > 160)
			errors.push(
				`${rel(path)}: description은 라우팅용으로 160자 이하여야 합니다.`,
			);
		if (description && descriptions.has(description))
			errors.push(`${rel(path)}: 다른 agent와 description이 중복됩니다.`);
		if (description) descriptions.add(description);
		errors.push(...validateAgentInstructions(instructions, rel(path), name));
	}
	if (!agentNames.has(AGENT_BUILDER_NAME))
		errors.push(
			`.codex/agents/${AGENT_BUILDER_NAME}.toml: 피드백 원칙을 소유하는 필수 역할이 없습니다.`,
		);

	const zcodeFiles = collectContractFiles(
		join(root, ".zcode", "agents"),
		(path) => path.endsWith(".md") && basename(path) !== "README.md",
	);
	const zcodeNames = new Set();
	if (zcodeFiles.length !== AGENT_COUNT)
		errors.push(
			`.zcode/agents 정의는 ${AGENT_COUNT}개여야 합니다. 현재 ${zcodeFiles.length}개입니다.`,
		);
	for (const path of zcodeFiles) {
		let source;
		let name;
		try {
			source = readAgentDefinitionSource(path);
			name = parseZcodeAgentDefinition(source, rel(path)).name;
		} catch (error) {
			errors.push(error.message);
			continue;
		}
		if (name && zcodeNames.has(name))
			errors.push(`${rel(path)}: 중복 agent name "${name}"입니다.`);
		if (name) zcodeNames.add(name);
		const tomlPath = join(root, ".codex", "agents", `${name}.toml`);
		if (!name || !existsSync(tomlPath)) {
			errors.push(
				`${rel(path)}: 대응하는 Codex 정의와 올바른 frontmatter가 필요합니다.`,
			);
			continue;
		}
		try {
			errors.push(
				...validateAgentPair({
					codexSource: readAgentDefinitionSource(tomlPath),
					zcodeSource: source,
					codexPath: rel(tomlPath),
					zcodePath: rel(path),
				}),
			);
		} catch (error) {
			errors.push(error.message);
		}
	}
	for (const name of agentNames)
		if (!zcodeNames.has(name))
			errors.push(`.zcode/agents/${name}.md: 대응 정의가 없습니다.`);
	for (const name of zcodeNames)
		if (!agentNames.has(name))
			errors.push(`.codex/agents/${name}.toml: 대응 정의가 없습니다.`);

	const codexConfig = read(join(root, ".codex", "config.toml"));
	if (!/^max_concurrent_threads_per_session\s*=\s*8\s*$/m.test(codexConfig))
		errors.push(
			".codex/config.toml: agents.max_concurrent_threads_per_session = 8 설정이 필요합니다.",
		);
	if (/^max_threads\s*=/m.test(codexConfig))
		errors.push(
			".codex/config.toml: legacy agents.max_threads를 사용할 수 없습니다.",
		);

	const rootContract = read(join(root, "AGENTS.md"));
	for (const headingText of REPORT_HEADINGS) {
		if (!rootContract.includes(`\`${headingText}\``))
			errors.push(
				`AGENTS.md: Worker 최종 보고 계약 ${headingText}이 없습니다.`,
			);
	}
	if (/COMMON\.md|SKILL\.md|\.agents\/skills|스킬/.test(rootContract))
		errors.push("AGENTS.md: 삭제된 외부 지침 체계 참조가 남아 있습니다.");
	for (const requiredContract of [
		"호출 단계가 지정되지 않으면 담당 단계로 실행합니다.",
		"호출 깊이는 루트 → 담당 → 하위까지입니다.",
		"전체 작업 트리에서 동시 write는 최대 4개, read-only는 최대 8개이며 부모의 직접 작업도 포함합니다.",
		"선행 산출물 요약",
		"재작업은 같은 담당 에이전트에",
		"부모의 전체 대화나 지시문을 전달하거나 안다고 가정하지 않습니다.",
		"호출 단계: 하위",
		"## 동시 실행 예산",
		"루트 세션",
	]) {
		if (!rootContract.includes(requiredContract))
			errors.push(
				`AGENTS.md: 공통 실행 계약 "${requiredContract}"이 없습니다.`,
			);
	}

	const definitionManagement = readMarkdownSection(
		rootContract,
		"## Agent 정의 관리",
	);
	for (const requiredToken of [
		".codex/agents/*.toml",
		".zcode/agents/*.md",
		"pnpm agents:sync",
		"pnpm agents:contracts:check",
		"원본",
		"생성본",
	]) {
		if (!definitionManagement.includes(requiredToken))
			errors.push(
				`AGENTS.md: Agent 정의 관리 절에 "${requiredToken}"이 없습니다.`,
			);
	}
	errors.push(...checkAgentDefinitionSync(root).errors);

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
				errors.push(
					".codex/hooks.json: 허용된 Agent 경계 이벤트만 설정해야 합니다.",
				);
			}
			for (const event of expected) {
				const groups = hooksConfig.hooks?.[event];
				if (!Array.isArray(groups) || groups.length !== 1) {
					errors.push(
						".codex/hooks.json: " +
							event +
							" matcher group은 정확히 하나여야 합니다.",
					);
					continue;
				}
				if (
					["PreToolUse", "PostToolUse"].includes(event) &&
					groups[0].matcher !== "^Agent$"
				) {
					errors.push(
						`.codex/hooks.json: ${event} matcher는 ^Agent$여야 합니다.`,
					);
				}
				const handlers = groups[0].hooks;
				if (!Array.isArray(handlers) || handlers.length !== 1) {
					errors.push(
						".codex/hooks.json: " +
							event +
							" command handler는 정확히 하나여야 합니다.",
					);
					continue;
				}
				const handler = handlers[0];
				if (
					handler.type !== "command" ||
					!handler.command?.includes("log-subagent-event.mjs")
				) {
					errors.push(
						".codex/hooks.json: " +
							event +
							"는 공통 raw logger를 사용해야 합니다.",
					);
				}
				if (!handler.command?.endsWith(` ${event}`)) {
					errors.push(
						`.codex/hooks.json: ${event} 이름을 logger에 전달해야 합니다.`,
					);
				}
			}
		} catch (error) {
			errors.push(`.codex/hooks.json: JSON 파싱 실패: ${error.message}`);
		}
	}

	const loggerPath = join(root, "scripts", "log-subagent-event.mjs");
	if (!existsSync(loggerPath)) {
		errors.push("scripts/log-subagent-event.mjs: raw logger가 없습니다.");
	} else {
		const logger = read(loggerPath);
		if (
			/(permissionDecision|additionalContext|decision\s*:|continue\s*:)/.test(
				logger,
			)
		) {
			errors.push(
				"scripts/log-subagent-event.mjs: logger는 실행 제어 출력을 만들 수 없습니다.",
			);
		}
	}

	const ignore = read(join(root, ".gitignore"));
	if (!/^\.codex\/logs\/$/m.test(ignore)) {
		errors.push(".gitignore: .codex/logs/ 제외 규칙이 없습니다.");
	}

	// ── 삭제된 체계의 잔여 참조 ──
	const stalePaths = [
		...collectContractFiles(join(root, "docs"), (path) => path.endsWith(".md")),
		join(root, "apps", "mobile", "src", "app", "app.context.md"),
		join(root, "package.json"),
	];
	for (const path of stalePaths) {
		if (existsSync(path) && /\.spec\.md/.test(read(path))) {
			errors.push(`${rel(path)}: 삭제된 *.spec.md 참조가 남아 있습니다.`);
		}
	}
	for (const file of [
		"spec-audit.js",
		"spec-generate.js",
		"check-mobile-screen-targets.mjs",
	]) {
		if (existsSync(join(root, "scripts", file))) {
			errors.push(
				`scripts/${file}: 삭제된 spec 체계의 script가 남아 있습니다.`,
			);
		}
	}

	const packageJson = JSON.parse(read(join(root, "package.json")));
	if (
		packageJson.scripts["agents:contracts:check"] !==
		"node scripts/check-agent-contracts.mjs"
	) {
		errors.push("package.json: agents:contracts:check 명령이 없습니다.");
	}
	if (
		packageJson.scripts["agents:contracts:test"] !==
		"node --test scripts/check-agent-contracts.test.mjs"
	) {
		errors.push("package.json: agents:contracts:test 명령이 없습니다.");
	}
	for (const [scriptName, expectedCommand] of [
		["agents:sync", "node scripts/sync-agent-definitions.mjs"],
		["agents:sync:check", "node scripts/sync-agent-definitions.mjs --check"],
		["agents:sync:test", "node --test scripts/sync-agent-definitions.test.mjs"],
	]) {
		if (packageJson.scripts[scriptName] !== expectedCommand)
			errors.push(`package.json: ${scriptName} 명령이 없습니다.`);
	}
	for (const scriptName of ["lint:repo", "lint:repo:fix", "test"]) {
		if (
			!packageJson.scripts[scriptName]?.startsWith(
				"pnpm agents:contracts:check && ",
			)
		)
			errors.push(
				`package.json: ${scriptName}은 읽기 전용 agent 계약 검사를 먼저 실행해야 합니다.`,
			);
		if (
			/\bpnpm(?:\s+run)?\s+agents:sync(?:\s|$)/.test(
				packageJson.scripts[scriptName] ?? "",
			)
		)
			errors.push(
				`package.json: ${scriptName}에서 agents:sync를 자동 실행할 수 없습니다.`,
			);
	}

	if (
		packageJson.scripts["agents:flow:test"] !==
		"node scripts/test-subagent-log-hook.mjs"
	) {
		errors.push("package.json: agents:flow:test 명령이 없습니다.");
	}
	for (const name of Object.keys(packageJson.scripts)) {
		if (name.startsWith("spec:") || name === "mobile:screen-targets:check") {
			errors.push(`package.json: 제거 대상 script "${name}"이 남아 있습니다.`);
		}
	}

	return { errors, agentCount: agentFiles.length };
}

if (process.argv[1] && resolve(process.argv[1]) === checkerPath) {
	const { errors, agentCount } = checkAgentContracts();
	if (errors.length) {
		console.error("Agent contract check failed:\n");
		for (const error of errors) console.error(`- ${error}`);
		process.exitCode = 1;
	} else {
		console.log(
			`Agent contract check passed: ${agentCount} self-contained agents (codex toml + zcode md sync), logging-only Hooks.`,
		);
	}
}

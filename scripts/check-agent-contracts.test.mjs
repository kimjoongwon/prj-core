import assert from "node:assert/strict";
import {
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
	AGENT_DEFINITION_COUNT,
	parseCodexAgentDefinition,
	renderZcodeAgentDefinition,
} from "./agent-definition-format.mjs";
import {
	checkAgentContracts,
	validateAgentInstructions,
	validateAgentPair,
} from "./check-agent-contracts.mjs";

// 실제 정의 파일과 독립된 계약 fixture입니다. 런타임 agent 호출은 실행하지 않습니다.
const standardInstructions = `## 역할·수정 범위
자기 역할의 산출물만 구현합니다.

## 입력 계약
### 요청에서 확인할 정보
목표와 수정 범위를 확인합니다.
### 저장소에서 직접 찾을 정보
기존 산출물과 사용처를 찾습니다.
### 구현 전 필수 조건
공개 계약과 선행 검증을 확인합니다.
### 입력 필요 조건
확보할 수 없는 제품 결정을 보고합니다.
- 담당은 저장소나 하위 작업으로 확보할 수 있는 입력 부족만으로 종료하지 않습니다.
- 입력 확인에서 멈춘 해당 작업은 변경하지 않습니다. 이미 완료된 하위 산출물은 보존하고 변경 경로를 보고합니다.

## 기술 규칙
역할의 공개 계약을 지킵니다.

## 단독 실행 계약
### 담당 단계
- 호출 단계가 지정되지 않으면 담당 단계로 실행합니다.
- 필요한 하위 역할은 사용자가 지정하지 않아도 name과 description으로 선택합니다.
- 필요한 다른 역할의 산출물은 해당 하위 에이전트에 생성·수정을 맡깁니다.
- 하위의 선행 입력이 부족하면 필요한 다른 하위를 먼저 실행하고, 산출물 요약을 전달하여 원래 하위를 재개합니다.
### 하위 단계
- 호출 깊이는 루트 → 담당 → 하위까지입니다.
- 하위로 받은 작업에서는 다른 에이전트를 호출하지 않습니다.
- 하위 요청에는 \`호출 단계: 하위\`를 반드시 포함합니다.
### 작업 전달과 결과 수집
- 하위 요청에 목표, 수정 범위, 사용자 결정, 선행 산출물, 완료 기준과 동시 실행 예산을 전달합니다.
- 부모의 전체 대화나 지시문을 전달하거나 안다고 가정하지 않습니다.
- 배정받은 수정 범위와 동시 실행 예산 안에서만 위임하고, 같은 파일·공개 export의 수정은 직렬로 실행합니다.
- 전체 작업 트리에서 동시 write는 최대 4개, read-only는 최대 8개이며 부모의 직접 작업도 포함합니다.
- 하위의 최종 보고, 산출물 경로, 공개 계약과 검증 결과를 확인하고, 필수 하위 결과가 모두 완료일 때만 연결합니다.

## 생성·리뷰·수정
- 기존 산출물과 사용처를 확인하고 재사용한 뒤 새 산출물을 생성하거나 기존 산출물을 수정합니다.
- 생성·수정 과정에서 역할 규칙, 공개 계약과 사용처를 리뷰하고, 자기 역할 범위의 위반을 직접 고칩니다.
- 자기 역할 밖의 파일은 직접 수정하지 않습니다.
- 하위 산출물의 규칙 위반이나 검증 실패는 같은 담당 에이전트에 핵심 오류와 재현 명령을 전달하여 수정·재검증합니다.

## 검증·보고
- 완료는 실제 산출물과 기본 검증 및 요청의 추가 완료 기준과 모든 필수 하위의 완료를 모두 충족했을 때만 사용합니다.
- 필수 입력을 확보할 수 없으면 입력 필요를 보고합니다.
- 완료 기준을 통과하지 못하면 검증 실패와 변경 경로, 핵심 오류 및 재현 명령을 보고합니다.
- 에이전트 런타임의 완료 상태와 프로젝트 작업 결과를 분리합니다.
\`\`\`markdown
## 작업 결과
완료 | 입력 필요 | 검증 실패
## 작업 요약
5문장 이내
## 변경 산출물
경로, 공개 계약과 용도
## 수행한 검증
명령과 결과
## 남은 문제
실제 차단 사항 또는 없음
\`\`\``;

const agentBuilderName = "etc-agent-builder";
const feedbackContractCases = [
	[
		"이유·의도·적용 조건·판단 기준",
		"사용자 피드백을 문제의 이유·의도·적용 조건·판단 기준으로 정리합니다.",
		"사용자 피드백을 표현의 목록으로 정리합니다.",
	],
	[
		"사례 블랙리스트와 무근거 범용 금지 방지",
		"특정 표현이 거부되었다는 사실만으로 이름 블랙리스트나 근거 없는 범용 금지를 만들지 않습니다.",
		"특정 표현이 거부되면 이름 블랙리스트와 범용 금지를 만듭니다.",
	],
	[
		"명시한 식별자·문구·한정 범위 보존",
		"사용자가 정확한 식별자·문구·한 작업에만 적용할 지시를 명시하면 해당 표기와 범위를 보존합니다.",
		"사용자가 정확한 식별자·문구·한 작업에만 적용할 지시를 명시해도 모든 작업에 적용합니다.",
	],
	[
		"불명확한 의미·적용 조건 확인",
		"피드백의 의미·이유·적용 조건을 요청과 기존 코드·계약에서 확인할 수 없으면 추측하여 일반화하지 않고 사용자에게 확인합니다.",
		"피드백의 의미·이유·적용 조건을 확인할 수 없으면 추측하여 일반화합니다.",
	],
	[
		"실제 영향 범위의 필요한 계약만 수정",
		"실제 영향을 받는 정의의 필요한 실행 계약만 맞춥니다.",
		"모든 정의의 전체 실행 계약을 덮어씁니다.",
	],
	[
		"기존 규칙 통합과 중복 제거",
		"기존 지시를 재사용·통합하고 중복 규칙을 제거합니다.",
		"기존 지시를 유지하고 중복 규칙을 추가합니다.",
	],
	[
		"다른 도메인과 허용·예외 사례 교차 검토",
		"새 원칙은 원래 사례, 다른 도메인의 적용 사례와 허용·예외 사례에서 검토하여 의미 보존을 확인합니다.",
		"새 원칙은 원래 사례에서만 검토하여 즉시 적용합니다.",
	],
];
const agentBuilderInstructions = standardInstructions.replace(
	"역할의 공개 계약을 지킵니다.",
	feedbackContractCases
		.map(([, contractStatement]) => `- ${contractStatement}`)
		.join("\n"),
);

function validateAgentBuilderInstructions(instructions) {
	return validateAgentInstructions(
		instructions,
		`${agentBuilderName}.toml`,
		agentBuilderName,
	);
}

function agentSources(
	agentName = "fixture-agent",
	description = "계약 fixture를 검증합니다.",
	instructions = standardInstructions,
) {
	const codexSource = `name = "${agentName}"\ndescription = "${description}"\nmodel = "fixture-model"\nmodel_reasoning_effort = "high"\ndeveloper_instructions = '''\n${instructions}\n'''\n`;
	return {
		codexPath: `${agentName}.toml`,
		zcodePath: `${agentName}.md`,
		codexSource,
		zcodeSource: renderZcodeAgentDefinition(
			parseCodexAgentDefinition(codexSource),
		),
	};
}

function createRepositoryFixture(testContext) {
	const fixtureRoot = mkdtempSync(join(tmpdir(), "agent-contracts-"));
	testContext.after(() =>
		rmSync(fixtureRoot, { recursive: true, force: true }),
	);
	mkdirSync(join(fixtureRoot, ".codex", "agents"), { recursive: true });
	mkdirSync(join(fixtureRoot, ".zcode", "agents"), { recursive: true });
	mkdirSync(join(fixtureRoot, "scripts"));
	for (
		let agentIndex = 0;
		agentIndex < AGENT_DEFINITION_COUNT;
		agentIndex += 1
	) {
		const isAgentBuilder = agentIndex === AGENT_DEFINITION_COUNT - 1;
		const agentName = isAgentBuilder
			? agentBuilderName
			: `fixture-agent-${agentIndex}`;
		const sources = agentSources(
			agentName,
			`계약 fixture ${agentIndex}를 검증합니다.`,
			isAgentBuilder ? agentBuilderInstructions : standardInstructions,
		);
		writeFileSync(
			join(fixtureRoot, ".codex", "agents", sources.codexPath),
			sources.codexSource,
		);
		writeFileSync(
			join(fixtureRoot, ".zcode", "agents", sources.zcodePath),
			sources.zcodeSource,
		);
	}
	writeFileSync(
		join(fixtureRoot, ".codex", "config.toml"),
		"[agents]\nmax_concurrent_threads_per_session = 8\n",
	);
	writeFileSync(
		join(fixtureRoot, "AGENTS.md"),
		`
## Agent 정의 관리
.codex/agents/*.toml은 원본, .zcode/agents/*.md는 생성본입니다.
pnpm agents:sync → pnpm agents:contracts:check

## 루트 계약
루트 세션
호출 단계가 지정되지 않으면 담당 단계로 실행합니다.
호출 깊이는 루트 → 담당 → 하위까지입니다.
전체 작업 트리에서 동시 write는 최대 4개, read-only는 최대 8개이며 부모의 직접 작업도 포함합니다.
선행 산출물 요약
재작업은 같은 담당 에이전트에 오류와 재현 명령을 전달합니다.
부모의 전체 대화나 지시문을 전달하거나 안다고 가정하지 않습니다.
호출 단계: 하위
## 동시 실행 예산
\`## 작업 결과\`
\`## 작업 요약\`
\`## 변경 산출물\`
\`## 수행한 검증\`
\`## 남은 문제\`
`,
	);
	const hooks = Object.fromEntries(
		[
			"UserPromptSubmit",
			"PreToolUse",
			"PostToolUse",
			"SubagentStart",
			"SubagentStop",
			"Stop",
		].map((eventName) => [
			eventName,
			[
				{
					...(["PreToolUse", "PostToolUse"].includes(eventName)
						? { matcher: "^Agent$" }
						: {}),
					hooks: [
						{
							type: "command",
							command: `node scripts/log-subagent-event.mjs ${eventName}`,
						},
					],
				},
			],
		]),
	);
	writeFileSync(
		join(fixtureRoot, ".codex", "hooks.json"),
		JSON.stringify({ hooks }),
	);
	writeFileSync(
		join(fixtureRoot, "scripts", "log-subagent-event.mjs"),
		"console.log('{}');\n",
	);
	writeFileSync(join(fixtureRoot, ".gitignore"), ".codex/logs/\n");
	writeFileSync(
		join(fixtureRoot, "package.json"),
		JSON.stringify({
			scripts: {
				"agents:sync": "node scripts/sync-agent-definitions.mjs",
				"agents:sync:check": "node scripts/sync-agent-definitions.mjs --check",
				"agents:sync:test":
					"node --test scripts/sync-agent-definitions.test.mjs",
				"lint:repo": "pnpm agents:contracts:check && biome lint scripts",
				"lint:repo:fix":
					"pnpm agents:contracts:check && biome lint scripts --write",
				test: "pnpm agents:contracts:check && pnpm agents:contracts:test && pnpm agents:sync:test && turbo test",
				"agents:contracts:check": "node scripts/check-agent-contracts.mjs",
				"agents:contracts:test":
					"node --test scripts/check-agent-contracts.test.mjs",
				"agents:flow:test": "node scripts/test-subagent-log-hook.mjs",
			},
		}),
	);
	return fixtureRoot;
}

function rewriteFixtureFile(fixtureRoot, relativePath, transformSource) {
	const fixturePath = join(fixtureRoot, relativePath);
	writeFileSync(
		fixturePath,
		transformSource(readFileSync(fixturePath, "utf8")),
	);
}

test("표준 절 구조와 보고 코드 블록을 포함한 담당/하위 계약을 허용한다", () => {
	assert.deepEqual(validateAgentInstructions(standardInstructions), []);
	assert.deepEqual(validateAgentPair(agentSources()), []);
});

test(`독립 ${AGENT_DEFINITION_COUNT}쌍 fixture와 logging-only 설정을 통합 검사한다`, (testContext) => {
	assert.deepEqual(checkAgentContracts(createRepositoryFixture(testContext)), {
		errors: [],
		agentCount: AGENT_DEFINITION_COUNT,
	});
});

test("피드백 추상화 계약은 신규 역할에서만 요구한다", () => {
	assert.deepEqual(
		validateAgentBuilderInstructions(agentBuilderInstructions),
		[],
	);
	assert.deepEqual(
		validateAgentInstructions(
			standardInstructions,
			"existing-agent.toml",
			"existing-agent",
		),
		[],
	);
	assert.ok(
		validateAgentBuilderInstructions(standardInstructions).some((error) =>
			error.includes("피드백 필수 계약"),
		),
	);
});

for (const [
	contractName,
	contractStatement,
	weakenedStatement,
] of feedbackContractCases) {
	for (const [mutationName, replacement] of [
		["누락", ""],
		["약화", weakenedStatement],
	]) {
		test(`피드백 ${contractName} 계약이 ${mutationName}되면 거부한다`, () => {
			const errors = validateAgentBuilderInstructions(
				agentBuilderInstructions.replace(contractStatement, replacement),
			);
			assert.equal(errors.length, 1, errors.join("\n"));
			assert.match(errors[0], /## 기술 규칙의 피드백 필수 계약/);
		});
	}
	test(`피드백 ${contractName} 계약이 다른 절로 이동하면 거부한다`, () => {
		const movedInstructions = agentBuilderInstructions
			.replace(`- ${contractStatement}`, "")
			.replace(
				"## 생성·리뷰·수정",
				`## 생성·리뷰·수정\n- ${contractStatement}`,
			);
		assert.equal(validateAgentBuilderInstructions(movedInstructions).length, 1);
	});
}

for (const [inactiveKind, wrapStatement] of [
	["코드 블록", (statement) => `\`\`\`text\n${statement}\n\`\`\``],
	["인용", (statement) => `> ${statement}`],
	["주석", (statement) => `<!-- ${statement} -->`],
]) {
	test(`피드백 필수 계약을 ${inactiveKind}으로 대체하면 거부한다`, () => {
		for (const [, contractStatement] of feedbackContractCases) {
			const inactiveInstructions = agentBuilderInstructions.replace(
				`- ${contractStatement}`,
				wrapStatement(contractStatement),
			);
			assert.equal(
				validateAgentBuilderInstructions(inactiveInstructions).length,
				1,
				contractStatement,
			);
		}
	});
}

test("최소 영향·중복 통합·사례 검토는 같은 의미의 긍정 표현을 허용한다", () => {
	const equivalentInstructions = agentBuilderInstructions
		.replace(
			"실제 영향을 받는 정의의 필요한 실행 계약만 맞춥니다.",
			"직접 영향을 받는 역할의 필요한 계약만 수정합니다.",
		)
		.replace(
			"기존 지시를 재사용·통합하고 중복 규칙을 제거합니다.",
			"기존 규칙을 재사용/통합하고 중복 설명을 정리합니다.",
		)
		.replace("허용·예외 사례에서 검토하여", "허용/예외 사례에서 확인하여");
	assert.deepEqual(
		validateAgentBuilderInstructions(equivalentInstructions),
		[],
	);
});

test("정의 수가 같아도 신규 피드백 owner가 다른 역할로 대체되면 거부한다", (testContext) => {
	const fixtureRoot = createRepositoryFixture(testContext);
	rmSync(join(fixtureRoot, ".codex", "agents", `${agentBuilderName}.toml`));
	rmSync(join(fixtureRoot, ".zcode", "agents", `${agentBuilderName}.md`));
	const replacementSources = agentSources(
		"replacement-agent",
		"다른 fixture입니다.",
	);
	writeFileSync(
		join(fixtureRoot, ".codex", "agents", replacementSources.codexPath),
		replacementSources.codexSource,
	);
	writeFileSync(
		join(fixtureRoot, ".zcode", "agents", replacementSources.zcodePath),
		replacementSources.zcodeSource,
	);
	const { errors, agentCount } = checkAgentContracts(fixtureRoot);
	assert.equal(agentCount, AGENT_DEFINITION_COUNT);
	assert.equal(errors.length, 1, errors.join("\n"));
	assert.match(
		errors[0],
		/etc-agent-builder\.toml: 피드백 원칙을 소유하는 필수 역할/,
	);
});

test("원본과 생성본이 함께 약화되어도 신규 역할의 계약 검사는 실패한다", (testContext) => {
	const fixtureRoot = createRepositoryFixture(testContext);
	const [, requiredStatement, weakenedStatement] = feedbackContractCases[2];
	for (const relativePath of [
		`.codex/agents/${agentBuilderName}.toml`,
		`.zcode/agents/${agentBuilderName}.md`,
	]) {
		rewriteFixtureFile(fixtureRoot, relativePath, (source) =>
			source.replace(requiredStatement, weakenedStatement),
		);
	}
	const { errors } = checkAgentContracts(fixtureRoot);
	assert.equal(errors.length, 1, errors.join("\n"));
	assert.match(
		errors[0],
		/etc-agent-builder\.toml: ## 기술 규칙의 피드백 필수 계약/,
	);
});

const requiredContractCases = [
	["담당 기본값", "호출 단계가 지정되지 않으면 담당 단계로 실행합니다."],
	[
		"자동 하위 선택",
		"필요한 하위 역할은 사용자가 지정하지 않아도 name과 description으로 선택합니다.",
	],
	[
		"다른 역할 위임",
		"필요한 다른 역할의 산출물은 해당 하위 에이전트에 생성·수정을 맡깁니다.",
	],
	[
		"입력 확보 후 재개",
		"하위의 선행 입력이 부족하면 필요한 다른 하위를 먼저 실행하고, 산출물 요약을 전달하여 원래 하위를 재개합니다.",
	],
	["호출 깊이", "호출 깊이는 루트 → 담당 → 하위까지입니다."],
	[
		"하위 추가 호출 금지",
		"하위로 받은 작업에서는 다른 에이전트를 호출하지 않습니다.",
	],
	["하위 단계 명시", "하위 요청에는 `호출 단계: 하위`를 반드시 포함합니다."],
	[
		"하위 요청 입력",
		"하위 요청에 목표, 수정 범위, 사용자 결정, 선행 산출물, 완료 기준과 동시 실행 예산을 전달합니다.",
	],
	[
		"부모 문맥 비의존",
		"부모의 전체 대화나 지시문을 전달하거나 안다고 가정하지 않습니다.",
	],
	[
		"수정 범위와 직렬화",
		"배정받은 수정 범위와 동시 실행 예산 안에서만 위임하고, 같은 파일·공개 export의 수정은 직렬로 실행합니다.",
	],
	[
		"전체 트리 예산",
		"전체 작업 트리에서 동시 write는 최대 4개, read-only는 최대 8개이며 부모의 직접 작업도 포함합니다.",
	],
	[
		"필수 하위 결과 수집",
		"하위의 최종 보고, 산출물 경로, 공개 계약과 검증 결과를 확인하고, 필수 하위 결과가 모두 완료일 때만 연결합니다.",
	],
	[
		"기존 산출물 재사용",
		"기존 산출물과 사용처를 확인하고 재사용한 뒤 새 산출물을 생성하거나 기존 산출물을 수정합니다.",
	],
	[
		"자체 리뷰와 규칙 수정",
		"생성·수정 과정에서 역할 규칙, 공개 계약과 사용처를 리뷰하고, 자기 역할 범위의 위반을 직접 고칩니다.",
	],
	["역할 밖 수정 금지", "자기 역할 밖의 파일은 직접 수정하지 않습니다."],
	[
		"같은 담당 재작업",
		"하위 산출물의 규칙 위반이나 검증 실패는 같은 담당 에이전트에 핵심 오류와 재현 명령을 전달하여 수정·재검증합니다.",
	],
];
for (const [contractName, contractStatement] of requiredContractCases) {
	test(`${contractName} 누락을 거부한다`, () => {
		const errors = validateAgentInstructions(
			standardInstructions.replace(contractStatement, ""),
		);
		assert.ok(
			errors.some((error) =>
				error.includes(`필수 계약이 없습니다: ${contractStatement}`),
			),
			errors.join("\n"),
		);
	});
}

test("담당 기본값이 다른 절로 이동하면 거부한다", () => {
	const defaultStatement =
		"호출 단계가 지정되지 않으면 담당 단계로 실행합니다.";
	const movedInstructions = standardInstructions
		.replace(defaultStatement, "")
		.replace("## 기술 규칙", `## 기술 규칙\n${defaultStatement}`);
	assert.ok(
		validateAgentInstructions(movedInstructions).some((error) =>
			error.includes("### 담당 단계의 필수 계약"),
		),
	);
});

for (const duplicateHeading of [
	"## 단독 실행 계약",
	"### 입력 필요 조건",
	"### 하위 단계",
]) {
	test(`${duplicateHeading} 중복을 거부한다`, () => {
		const duplicateInstructions = standardInstructions.replace(
			duplicateHeading,
			`${duplicateHeading}\n${duplicateHeading}`,
		);
		assert.ok(
			validateAgentInstructions(duplicateInstructions).some((error) =>
				error.includes(`"${duplicateHeading}"은 정확히 하나`),
			),
		);
	});
}

test("기존 무조건 worker 위임 금지 문장이 남으면 거부한다", () => {
	const bannedInstructions = standardInstructions.replace(
		"## 기술 규칙",
		"## 기술 규칙\nWorker는 다른 custom agent나 subagent를 호출하거나 후속 owner와 실행 순서를 선택하지 않습니다.",
	);
	assert.ok(
		validateAgentInstructions(bannedInstructions).some((error) =>
			error.includes("무조건 위임 금지"),
		),
	);
});

test("담당에게 하위 호출을 무조건 금지하는 문장은 위치와 관계없이 거부한다", () => {
	for (const headingText of ["### 담당 단계", "### 하위 단계"]) {
		const bannedInstructions = standardInstructions.replace(
			headingText,
			`${headingText}\n담당은 다른 하위 에이전트를 호출하지 않습니다.`,
		);
		assert.ok(
			validateAgentInstructions(bannedInstructions).some((error) =>
				error.includes("무조건 위임 금지"),
			),
		);
	}
});

test("필요한 후속 subagent 선택과 사용자 호출 제한은 허용한다", () => {
	const scopedInstructions = standardInstructions.replace(
		"## 기술 규칙",
		"## 기술 규칙\n필요한 next subagent를 선택합니다.\n사용자가 금지하면 다른 에이전트를 호출하지 않습니다.",
	);
	assert.deepEqual(validateAgentInstructions(scopedInstructions), []);
});

const statusContractCases = [
	[
		"확보 가능한 입력 부족으로 종료하지 않는 계약",
		"담당은 저장소나 하위 작업으로 확보할 수 있는 입력 부족만으로 종료하지 않습니다.",
		"확보 가능한 입력 부족",
	],
	[
		"입력 필요의 무변경 계약",
		"입력 확인에서 멈춘 해당 작업은 변경하지 않습니다.",
		"변경 없음 계약",
	],
	[
		"부분 산출물 보존과 경로 보고",
		"이미 완료된 하위 산출물은 보존하고 변경 경로를 보고합니다.",
		"하위 산출물 보존",
	],
	[
		"런타임 상태와 작업 결과 분리",
		"에이전트 런타임의 완료 상태와 프로젝트 작업 결과를 분리합니다.",
		"런타임 완료 상태",
	],
];
for (const [
	contractName,
	contractStatement,
	errorText,
] of statusContractCases) {
	test(`${contractName} 누락을 거부한다`, () => {
		const errors = validateAgentInstructions(
			standardInstructions.replace(contractStatement, ""),
		);
		assert.ok(
			errors.some((error) => error.includes(errorText)),
			errors.join("\n"),
		);
	});
}

test("하위 단계 명시가 전달 소절로 이동하면 거부한다", () => {
	const lowerStageStatement =
		"하위 요청에는 `호출 단계: 하위`를 반드시 포함합니다.";
	const movedInstructions = standardInstructions
		.replace(lowerStageStatement, "")
		.replace(
			"### 작업 전달과 결과 수집",
			`### 작업 전달과 결과 수집\n${lowerStageStatement}`,
		);
	assert.ok(
		validateAgentInstructions(movedInstructions).some((error) =>
			error.includes("### 하위 단계의 필수 계약"),
		),
	);
});

test("입력 확보 종료 금지 계약은 입력 필요 조건에서 확인한다", () => {
	const inputStatement =
		"담당은 저장소나 하위 작업으로 확보할 수 있는 입력 부족만으로 종료하지 않습니다.";
	const movedInstructions = standardInstructions
		.replace(inputStatement, "")
		.replace("## 검증·보고", `## 검증·보고\n${inputStatement}`);
	assert.ok(
		validateAgentInstructions(movedInstructions).some((error) =>
			error.includes("확보 가능한 입력 부족"),
		),
	);
});

test("입력 확인 미착수 작업의 변경 없음 표현 변형을 허용한다", () => {
	for (const unchangedStatement of [
		"입력 확인에서 멈춘 해당 작업은 변경이 없어야 합니다.",
		"입력 확인에서 멈춘 해당 작업은 변경 없음으로 보고합니다.",
		"입력 확인에서 멈춘 해당 작업은 파일을 변경하지 않습니다.",
	]) {
		assert.deepEqual(
			validateAgentInstructions(
				standardInstructions.replace(
					"입력 확인에서 멈춘 해당 작업은 변경하지 않습니다.",
					unchangedStatement,
				),
			),
			[],
		);
	}
});

test("이미 또는 앞서 완료된 하위 산출물의 보존과 경로 보고 표현을 허용한다", () => {
	for (const partialArtifactStatement of [
		"앞서 완료된 하위 산출물은 보존하고 경로를 보고합니다.",
		"앞서 완료한 하위 산출물은 보존하고 경로를 보고합니다.",
		"이미 완료한 하위 산출물은 보존하고 변경 경로를 보고합니다.",
	]) {
		assert.deepEqual(
			validateAgentInstructions(
				standardInstructions.replace(
					"이미 완료된 하위 산출물은 보존하고 변경 경로를 보고합니다.",
					partialArtifactStatement,
				),
			),
			[],
		);
	}
});

test("담당 단계의 저장소 탐색과 하위 작업을 통한 입력 확보 표현을 허용한다", () => {
	assert.deepEqual(
		validateAgentInstructions(
			standardInstructions.replace(
				"담당은 저장소나 하위 작업으로 확보할 수 있는 입력 부족만으로 종료하지 않습니다.",
				"담당 단계는 저장소 탐색이나 하위 작업으로 확보할 수 있는 입력이 부족하다는 이유만으로 종료하지 않습니다.",
			),
		),
		[],
	);
});

const completionStatement =
	"완료는 실제 산출물과 기본 검증 및 요청의 추가 완료 기준과 모든 필수 하위의 완료를 모두 충족했을 때만 사용합니다.";
test("충족과 통과 표현 모두 기본 검증·추가 기준·필수 하위 완료를 요구한다", () => {
	for (const equivalentCompletionStatement of [
		"자기 기본 검증과 추가 완료 기준, 모든 필수 하위의 완료를 충족해야 `완료`입니다.",
		"자기 기본 검증과 요청의 추가 완료 기준을 통과하고 모든 필수 하위가 완료해야 `완료`입니다.",
		"자기 범위의 기본 검증과 요청의 추가 완료 기준을 통과하고 모든 필수 하위 결과가 완료여야 `완료`입니다.",
	]) {
		assert.deepEqual(
			validateAgentInstructions(
				standardInstructions.replace(
					completionStatement,
					equivalentCompletionStatement,
				),
			),
			[],
		);
	}
});

for (const missingCompletionCondition of [
	"기본 검증",
	"추가 완료 기준",
	"모든 필수 하위의 완료",
]) {
	test(`완료 조건의 ${missingCompletionCondition} 누락을 거부한다`, () => {
		const incompleteCompletion = completionStatement.replace(
			missingCompletionCondition,
			"",
		);
		assert.ok(
			validateAgentInstructions(
				standardInstructions.replace(completionStatement, incompleteCompletion),
			).some((error) => error.includes("완료 판정 계약이 없습니다")),
		);
	});
}

test("검증 실패 조건을 성공 완료 판정으로 오인하지 않는다", () => {
	const negativeCompletion =
		"기본 검증과 추가 완료 기준을 통과하지 못하고 모든 필수 하위가 완료하지 못하면 `완료`로 보고하지 않고 검증 실패입니다.";
	assert.ok(
		validateAgentInstructions(
			standardInstructions.replace(completionStatement, negativeCompletion),
		).some((error) => error.includes("완료 판정 계약이 없습니다")),
	);
});

test("검증·보고에서 입력 필요 상태와 최종 보고 항목 누락을 거부한다", () => {
	const [instructionsBeforeReport, reportInstructions] =
		standardInstructions.split("## 검증·보고");
	const modifiedReport = reportInstructions
		.replaceAll("입력 필요", "대기")
		.replace("## 남은 문제", "누락된 보고 항목");
	const errors = validateAgentInstructions(
		`${instructionsBeforeReport}## 검증·보고${modifiedReport}`,
	);
	assert.ok(errors.some((error) => error.includes('작업 결과 "입력 필요"')));
	assert.ok(
		errors.some((error) => error.includes('최종 보고 항목 "## 남은 문제"')),
	);
});

test("이미 완료된 산출물의 경로 보고만 빠져도 거부한다", () => {
	const noPartialPaths = standardInstructions.replace(
		"이미 완료된 하위 산출물은 보존하고 변경 경로를 보고합니다.",
		"이미 완료된 하위 산출물은 보존합니다.",
	);
	assert.ok(
		validateAgentInstructions(noPartialPaths).some((error) =>
			error.includes("변경 경로 보고 계약"),
		),
	);
});

test("Codex/ZCode 본문과 description 불일치를 각각 거부한다", () => {
	const sources = agentSources();
	const mismatchedBody = validateAgentPair({
		...sources,
		zcodeSource: sources.zcodeSource.replace(
			"자기 역할의 산출물만 구현합니다.",
			"다른 본문입니다.",
		),
	});
	assert.ok(mismatchedBody.some((error) => error.includes("본문이")));
	const mismatchedDescription = validateAgentPair({
		...sources,
		zcodeSource: sources.zcodeSource.replace(
			'description: "계약 fixture를 검증합니다."',
			'description: "다른 설명입니다."',
		),
	});
	assert.ok(
		mismatchedDescription.some((error) => error.includes("description이")),
	);
});

test("ZCode name 불일치와 추가 frontmatter 필드를 각각 거부한다", () => {
	const sources = agentSources();
	const nameErrors = validateAgentPair({
		...sources,
		zcodeSource: sources.zcodeSource.replace(
			"name: fixture-agent",
			"name: other-agent",
		),
	});
	assert.ok(nameErrors.some((error) => error.includes("name이")));
	const fieldErrors = validateAgentPair({
		...sources,
		zcodeSource: sources.zcodeSource.replace(
			"name: fixture-agent",
			'name: fixture-agent\nmodel: "unexpected"',
		),
	});
	assert.ok(
		fieldErrors.some((error) => error.includes('frontmatter 필드 "model"')),
	);
});

test(`${AGENT_DEFINITION_COUNT}쌍 fixture에서 빠진 정의와 모델 metadata를 거부한다`, (testContext) => {
	const fixtureRoot = createRepositoryFixture(testContext);
	rmSync(join(fixtureRoot, ".zcode", "agents", "fixture-agent-0.md"));
	rewriteFixtureFile(
		fixtureRoot,
		".codex/agents/fixture-agent-1.toml",
		(source) => source.replace('model_reasoning_effort = "high"\n', ""),
	);
	const { errors } = checkAgentContracts(fixtureRoot);
	assert.ok(
		errors.some((error) =>
			error.includes(`현재 ${AGENT_DEFINITION_COUNT - 1}개`),
		),
	);
	assert.ok(
		errors.some((error) =>
			error.includes("model_reasoning_effort 필드가 없습니다"),
		),
	);
	assert.ok(
		errors.some((error) =>
			error.includes("fixture-agent-0.md: 대응 정의가 없습니다"),
		),
	);
});

test("기존 Hook matcher와 실행 제어 logger 검사를 유지한다", (testContext) => {
	const fixtureRoot = createRepositoryFixture(testContext);
	rewriteFixtureFile(fixtureRoot, ".codex/hooks.json", (source) =>
		source.replace('"^Agent$"', '".*"'),
	);
	writeFileSync(
		join(fixtureRoot, "scripts", "log-subagent-event.mjs"),
		'console.log({ permissionDecision: "allow" });\n',
	);
	const { errors } = checkAgentContracts(fixtureRoot);
	assert.ok(errors.some((error) => error.includes("matcher는 ^Agent$")));
	assert.ok(
		errors.some((error) => error.includes("실행 제어 출력을 만들 수 없습니다")),
	);
});

test("계약 검사도 생성 안내 주석 drift를 감지하며 생성본을 수정하지 않는다", (testContext) => {
	const fixtureRoot = createRepositoryFixture(testContext);
	const generatedPath = join(
		fixtureRoot,
		".zcode",
		"agents",
		"fixture-agent-0.md",
	);
	rewriteFixtureFile(
		fixtureRoot,
		".zcode/agents/fixture-agent-0.md",
		(source) => source.replace(/^# 자동 생성:.*\n/m, ""),
	);
	const beforeSource = readFileSync(generatedPath, "utf8");
	const { errors } = checkAgentContracts(fixtureRoot);
	assert.equal(errors.length, 1);
	assert.match(
		errors[0],
		/원본 \.codex\/agents\/fixture-agent-0\.toml의 변환 결과와 다릅니다/,
	);
	assert.match(errors[0], /pnpm agents:sync:check/);
	assert.equal(readFileSync(generatedPath, "utf8"), beforeSource);
});

test("단일 원본 편집 규칙은 Agent 정의 관리 절에서 확인한다", (testContext) => {
	const fixtureRoot = createRepositoryFixture(testContext);
	rewriteFixtureFile(fixtureRoot, "AGENTS.md", (source) =>
		source
			.replace(".codex/agents/*.toml", "Codex 정의")
			.replace("## 루트 계약", "## 루트 계약\n.codex/agents/*.toml"),
	);
	const { errors } = checkAgentContracts(fixtureRoot);
	assert.ok(
		errors.some((error) =>
			error.includes('Agent 정의 관리 절에 ".codex/agents/*.toml"이 없습니다'),
		),
	);
});

for (const scriptName of ["lint:repo", "lint:repo:fix", "test"]) {
	test(`${scriptName} 단독 실행에서도 실제 agent 계약 검사를 먼저 실행해야 한다`, (testContext) => {
		const fixtureRoot = createRepositoryFixture(testContext);
		rewriteFixtureFile(fixtureRoot, "package.json", (source) => {
			const packageJson = JSON.parse(source);
			packageJson.scripts[scriptName] = packageJson.scripts[scriptName].replace(
				"pnpm agents:contracts:check && ",
				"",
			);
			return JSON.stringify(packageJson);
		});
		assert.ok(
			checkAgentContracts(fixtureRoot).errors.some((error) =>
				error.includes(`${scriptName}은 읽기 전용 agent 계약 검사를 먼저`),
			),
		);
	});
}

test("검증 진입점에 생성 command를 추가하여 자동 동기화할 수 없다", (testContext) => {
	const fixtureRoot = createRepositoryFixture(testContext);
	rewriteFixtureFile(fixtureRoot, "package.json", (source) => {
		const packageJson = JSON.parse(source);
		packageJson.scripts.test += " && pnpm agents:sync";
		return JSON.stringify(packageJson);
	});
	assert.ok(
		checkAgentContracts(fixtureRoot).errors.some((error) =>
			error.includes("test에서 agents:sync를 자동 실행할 수 없습니다"),
		),
	);
});

test("짝을 읽는 중 잘못된 UTF-8 원본도 예외 종료 대신 검사 실패로 보고한다", (testContext) => {
	const fixtureRoot = createRepositoryFixture(testContext);
	writeFileSync(
		join(fixtureRoot, ".codex", "agents", "fixture-agent-0.toml"),
		Buffer.from([0xc3, 0x28]),
	);
	assert.ok(
		checkAgentContracts(fixtureRoot).errors.some((error) =>
			error.includes("UTF-8"),
		),
	);
});

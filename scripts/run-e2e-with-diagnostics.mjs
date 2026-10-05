#!/usr/bin/env node
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputLimit = 240_000;

const steps = {
	admin: {
		label: "Admin E2E",
		command: ["pnpm", ["--filter=test-e2e", "run", "test:admin:run"]],
	},
	adminHeaded: {
		label: "Admin E2E headed",
		command: [
			"pnpm",
			["--filter=test-e2e", "run", "test:admin:headed:run"],
		],
	},
	adminUi: {
		label: "Admin E2E UI",
		command: ["pnpm", ["--filter=test-e2e", "run", "test:admin:ui:run"]],
	},
	adminDebug: {
		label: "Admin E2E debug",
		command: [
			"pnpm",
			["--filter=test-e2e", "run", "test:admin:debug:run"],
		],
	},
	api: {
		label: "API E2E",
		command: ["pnpm", ["--filter=test-e2e", "run", "test:api:e2e:run"]],
	},
};

const modeAliases = {
	"admin-headed": "adminHeaded",
	"admin-ui": "adminUi",
	"admin-debug": "adminDebug",
};

const passthroughModeAliases = {
	"--headed": "adminHeaded",
	"--ui": "adminUi",
	"--debug": "adminDebug",
};

const diagnostics = [
	{
		name: "E2E DB URL 누락",
		kind: "environment",
		patterns: [
			/E2E_DATABASE_URL.*TEST_DATABASE_URL.*DATABASE_URL.*required/is,
			/E2E_DATABASE_URL or TEST_DATABASE_URL is required/is,
			/E2E database .* does not exist and could not be created/is,
		],
		message:
			"E2E 전용 데이터베이스를 찾지 못했거나 만들 수 없습니다. 기본 DB는 `plate_e2e`이며, 이 DB를 생성할 권한이 필요합니다.",
		help: "예: `E2E_DATABASE_URL=postgresql://.../prj_core_e2e pnpm test:e2e` 또는 로컬 Postgres에 `plate_e2e` DB를 생성하세요.",
	},
	{
		name: "E2E DB reset 보호 정책",
		kind: "environment",
		patterns: [/Refusing to reset database/is, /Refusing to reset production-like database/is],
		message:
			"E2E DB reset 보호 정책 때문에 실행이 중단되었습니다. DB 이름에 `e2e` 또는 `test`가 포함되어야 합니다.",
		help: "`ALLOW_E2E_DB_RESET=1`은 정말 버려도 되는 DB에만 사용하세요.",
	},
	{
		name: "E2E DB URL 형식 오류",
		kind: "environment",
		patterns: [/E2E database URL is not a valid URL/is, /Invalid URL/is],
		message:
			"E2E 데이터베이스 URL 형식이 올바르지 않습니다. PostgreSQL URL 전체 형식을 확인해야 합니다.",
		help: "예: `postgresql://user:password@localhost:5432/prj_core_e2e`",
	},
	{
		name: "데이터베이스 접속 실패",
		kind: "environment",
		patterns: [
			/P1001/is,
			/P1002/is,
			/Can't reach database server/is,
			/connect ECONNREFUSED .*5432/is,
			/ECONNREFUSED.*5432/is,
			/Connection refused/is,
		],
		message:
			"PostgreSQL에 접속하지 못했습니다. DB 서버가 실행 중인지, 포트와 URL이 맞는지 확인해야 합니다.",
		help: "로컬 DB를 먼저 띄운 뒤 다시 실행하세요.",
	},
	{
		name: "데이터베이스 인증 실패",
		kind: "environment",
		patterns: [/P1000/is, /Authentication failed against database server/is],
		message:
			"PostgreSQL 인증에 실패했습니다. E2E DB URL의 사용자명과 비밀번호를 확인해야 합니다.",
		help: "`E2E_DATABASE_URL` 또는 `TEST_DATABASE_URL`의 계정 정보를 확인하세요.",
	},
	{
		name: "Prisma 스키마 또는 seed 실패",
		kind: "environment",
		patterns: [
			/Prisma schema validation/is,
			/P1012/is,
			/prisma db push/is,
			/prisma db seed/is,
			/PRISMA_SEED_PROFILE/is,
			/E2E seed contract/is,
			/assertE2eSeedContract/is,
		],
		message:
			"Prisma schema 반영 또는 E2E seed 생성 중 실패했습니다. 테스트 본문 실행 전 준비 단계 실패입니다.",
		help: "`pnpm --filter=@cocrepo/prisma run schema:check`와 `pnpm --filter=@cocrepo/prisma db:e2e:reset`을 따로 실행해 원인을 좁혀보세요.",
	},
	{
		name: "Playwright 브라우저 누락",
		kind: "environment",
		patterns: [
			/Executable doesn't exist/is,
			/playwright install/is,
			/Looks like Playwright.*was just installed/is,
			/browserType\.launch/is,
		],
		message:
			"Playwright 브라우저 실행 파일이 준비되지 않았습니다. 브라우저 설치/캐시 단계 실패입니다.",
		help: "`pnpm --filter=test-e2e run install:browsers`를 실행한 뒤 다시 시도하세요.",
	},
	{
		name: "Playwright 시스템 의존성 누락",
		kind: "environment",
		patterns: [/Host system is missing dependencies/is, /playwright install-deps/is],
		message:
			"Playwright가 필요한 OS 시스템 의존성이 없습니다. 테스트 코드 실패가 아니라 실행 환경 문제입니다.",
		help: "OS별 Playwright dependency 설치가 필요합니다.",
	},
	{
		name: "포트 충돌",
		kind: "environment",
		patterns: [/EADDRINUSE/is, /address already in use/is, /listen .* already in use/is],
		message:
			"E2E 서버가 사용할 포트가 이미 사용 중입니다. Admin 또는 Core API 포트 충돌입니다.",
		help: "`lsof -nP -iTCP:3000 -sTCP:LISTEN` 또는 `lsof -nP -iTCP:3006 -sTCP:LISTEN`로 점유 프로세스를 확인하세요.",
	},
	{
		name: "Core API 서버 시작 실패",
		kind: "environment",
		patterns: [
			/Timed out waiting .*localhost:3006/is,
			/Timed out waiting .*\/api-json/is,
			/Process from config\.webServer was not able to start/is,
			/E2E_CORE_API_BASE_URL/is,
			/ERR_CONNECTION_REFUSED.*3006/is,
			/ECONNREFUSED.*3006/is,
		],
		message:
			"Core API 서버가 뜨지 않았거나 `/api-json` 응답 준비 전에 타임아웃이 발생했습니다.",
		help: "`pnpm --filter=core-api run start:e2e`가 단독으로 뜨는지 확인하세요.",
	},
	{
		name: "Admin Web 서버 시작 실패",
		kind: "environment",
		patterns: [
			/Timed out waiting .*localhost:3000/is,
			/Timed out waiting .*\/admin\/auth\/login/is,
			/E2E_ADMIN_BASE_URL is required/is,
			/ERR_CONNECTION_REFUSED.*3000/is,
			/ECONNREFUSED.*3000/is,
		],
		message:
			"Admin Web 서버가 뜨지 않았거나 로그인 페이지 응답 준비 전에 타임아웃이 발생했습니다.",
		help: "`pnpm --filter=admin-web exec next dev --webpack -p 3000`가 단독으로 뜨는지 확인하세요.",
	},
	{
		name: "SKIP_WEBSERVER 사용 중 서버 없음",
		kind: "environment",
		patterns: [/SKIP_WEBSERVER/is, /net::ERR_CONNECTION_REFUSED/is],
		message:
			"`SKIP_WEBSERVER=1` 상태에서 필요한 로컬 서버에 연결하지 못했습니다. 서버 자동 시작이 꺼져 있습니다.",
		help: "직접 서버를 띄우거나 `SKIP_WEBSERVER`를 제거하고 실행하세요.",
	},
	{
		name: "Redis 접속 실패",
		kind: "environment",
		patterns: [/Redis.*ECONNREFUSED/is, /ECONNREFUSED.*6379/is],
		message:
			"Core API가 Redis에 접속하지 못했습니다. Redis가 필요한 실행 경로에서 환경 준비가 되지 않았습니다.",
		help: "로컬 Redis를 실행하거나 E2E용 Redis 설정을 확인하세요.",
	},
	{
		name: "workspace 의존성 또는 명령 실행 실패",
		kind: "environment",
		patterns: [
			/Cannot find module/is,
			/spawn pnpm ENOENT/is,
			/pnpm: command not found/is,
			/command not found: pnpm/is,
		],
		message:
			"workspace 의존성 또는 pnpm 실행 환경이 준비되지 않았습니다. 테스트 코드 실행 전 단계 실패입니다.",
		help: "`corepack enable` 및 `pnpm install` 상태를 확인하세요.",
	},
	{
		name: "E2E 스크립트 연결 오류",
		kind: "environment",
		patterns: [
			/None of the selected packages has .* script/is,
			/ERR_PNPM_NO_SCRIPT/is,
			/No projects matched the filters/is,
		],
		message:
			"E2E 스크립트가 잘못된 workspace package 또는 script 이름을 가리키고 있습니다.",
		help: "루트 package.json의 E2E script filter와 apps/test/e2e/package.json의 script 이름을 확인하세요.",
	},
	{
		name: "Playwright 테스트 선택 오류",
		kind: "environment",
		patterns: [/No tests found/is],
		message:
			"Playwright가 실행할 테스트를 찾지 못했습니다. 옵션이 테스트 파일 패턴으로 전달되었거나 testMatch/project 설정이 맞지 않습니다.",
		help: "`pnpm test:e2e -- --dry-run`과 Playwright command line 인자 전달 방식을 확인하세요.",
	},
];

/**
 * CLI 인자를 해석해 실행할 E2E 대상과 옵션을 결정합니다.
 *
 * @param {string[]} args 프로세스 argv에서 전달된 사용자 인자입니다.
 * @returns {{ mode: "all" | "admin" | "api" | "adminHeaded" | "adminUi" | "adminDebug"; help: boolean; dryRun: boolean }} 실행 설정입니다.
 */
function parseArgs(args) {
	const separatorIndex = args.indexOf("--");
	const wrapperArgs =
		separatorIndex === -1 ? args : args.slice(0, separatorIndex);
	const rawPassthroughArgs =
		separatorIndex === -1 ? [] : args.slice(separatorIndex + 1);
	const passthroughArgs = rawPassthroughArgs.filter(
		(arg) => arg !== "--dry-run" && arg !== "--",
	);
	const requestedPassthroughModes = passthroughArgs.filter(
		(arg) => arg in passthroughModeAliases,
	);
	const unknownPassthroughArgs = passthroughArgs.filter(
		(arg) => !(arg in passthroughModeAliases),
	);

	if (wrapperArgs.includes("--help") || wrapperArgs.includes("-h")) {
		return {
			mode: "all",
			help: true,
			dryRun: false,
		};
	}

	const rawMode = wrapperArgs.find((arg) => !arg.startsWith("-")) ?? "all";
	const mode = modeAliases[rawMode] ?? rawMode;
	if (["all", "admin", "api", "adminHeaded", "adminUi", "adminDebug"].includes(mode)) {
		if (requestedPassthroughModes.length > 1) {
			console.error(
				"Admin E2E 실행 모드는 한 번에 하나만 선택할 수 있습니다.",
			);
			console.error("예: pnpm test:e2e:headed");
			process.exit(1);
		}

		if (unknownPassthroughArgs.length > 0) {
			console.error(
				`지원하지 않는 E2E 추가 옵션입니다: ${unknownPassthroughArgs.join(" ")}`,
			);
			console.error("지원 옵션: --headed, --ui, --debug");
			process.exit(1);
		}

		const passthroughMode =
			requestedPassthroughModes.length === 1
				? passthroughModeAliases[requestedPassthroughModes[0]]
				: undefined;

		if (passthroughMode && mode !== "admin") {
			console.error(
				"추가 Playwright 실행 모드는 admin E2E에서만 사용할 수 있습니다.",
			);
			console.error("예: node scripts/run-e2e-with-diagnostics.mjs admin -- --headed");
			process.exit(1);
		}

		return {
			mode: passthroughMode ?? mode,
			help: false,
			dryRun:
				wrapperArgs.includes("--dry-run") ||
				rawPassthroughArgs.includes("--dry-run"),
		};
	}

	console.error(`알 수 없는 E2E 실행 대상입니다: ${rawMode}`);
	console.error(
		"사용법: node scripts/run-e2e-with-diagnostics.mjs [all|admin|api|admin-headed|admin-ui|admin-debug]",
	);
	process.exit(1);
}

/**
 * 실행 모드에 맞는 단계 목록을 반환합니다.
 *
 * @param {"all" | "admin" | "api" | "adminHeaded" | "adminUi" | "adminDebug"} mode 실행 모드입니다.
 * @returns {Array<typeof steps.admin>} 실행할 단계 목록입니다.
 */
function getStepsForMode(mode) {
	if (mode === "admin") return [steps.admin];
	if (mode === "adminHeaded") return [steps.adminHeaded];
	if (mode === "adminUi") return [steps.adminUi];
	if (mode === "adminDebug") return [steps.adminDebug];
	if (mode === "api") return [steps.api];
	return [steps.admin, steps.api];
}

/**
 * 출력 버퍼를 tail 중심으로 제한해 장시간 E2E 로그 메모리 사용을 제한합니다.
 *
 * @param {string} current 현재까지 수집한 출력입니다.
 * @param {string} chunk 새로 추가할 출력입니다.
 * @returns {string} 제한된 출력입니다.
 */
function appendOutput(current, chunk) {
	const next = current + chunk;
	if (next.length <= outputLimit) {
		return next;
	}

	return next.slice(next.length - outputLimit);
}

/**
 * 하위 프로세스를 실행하면서 출력은 그대로 보여주고 진단용 로그도 수집합니다.
 *
 * @param {{ label: string; command: [string, string[]] }} step 실행 단계 정의입니다.
 * @returns {Promise<{ status: number; output: string; signal?: NodeJS.Signals }>} 실행 결과입니다.
 */
function runStep(step) {
	const [bin, args] = step.command;

	return new Promise((resolveStep) => {
		const child = spawn(bin, args, {
			cwd: repoRoot,
			env: process.env,
			stdio: ["inherit", "pipe", "pipe"],
		});

		let output = "";

		child.stdout.on("data", (chunk) => {
			const text = chunk.toString();
			output = appendOutput(output, text);
			process.stdout.write(chunk);
		});

		child.stderr.on("data", (chunk) => {
			const text = chunk.toString();
			output = appendOutput(output, text);
			process.stderr.write(chunk);
		});

		child.on("error", (error) => {
			const text = `${error.name}: ${error.message}`;
			output = appendOutput(output, text);
			resolveStep({ status: 1, output });
		});

		child.on("exit", (code, signal) => {
			resolveStep({ status: code ?? 1, output, signal: signal ?? undefined });
		});
	});
}

/**
 * 실패 로그에서 테스트 실패가 아닌 실행 환경 문제를 모두 찾아냅니다.
 *
 * @param {string} output 하위 프로세스 출력입니다.
 * @returns {typeof diagnostics} 매칭된 진단 목록입니다.
 */
function matchDiagnostics(output) {
	return diagnostics.filter((diagnostic) =>
		diagnostic.patterns.some((pattern) => pattern.test(output)),
	);
}

/**
 * Playwright/Jest 테스트 본문 실패로 보이는지 판단합니다.
 *
 * @param {string} output 하위 프로세스 출력입니다.
 * @returns {boolean} 테스트 실패로 추정되면 true입니다.
 */
function looksLikeTestFailure(output) {
	return [
		/\bfailed\b.*\bpassed\b/is,
		/\bexpect\(/is,
		/TimeoutError:/is,
		/Test timeout of .* exceeded/is,
		/FAIL .*\.e2e\./is,
		/Tests:\s+\d+ failed/is,
	].some((pattern) => pattern.test(output));
}

/**
 * 실패 원인을 한글로 출력합니다.
 *
 * @param {{ label: string }} step 실패한 단계입니다.
 * @param {{ status: number; output: string; signal?: NodeJS.Signals }} result 실행 결과입니다.
 * @returns {void}
 */
function printFailureSummary(step, result) {
	const matchedDiagnostics = matchDiagnostics(result.output);
	const hasEnvironmentFailure = matchedDiagnostics.some(
		(diagnostic) => diagnostic.kind === "environment",
	);

	console.error("");
	console.error("============================================================");
	console.error("E2E 실행 실패 진단");
	console.error("============================================================");
	console.error(`실패 단계: ${step.label}`);
	console.error(
		`종료 상태: ${result.signal ? `signal ${result.signal}` : result.status}`,
	);

	if (matchedDiagnostics.length > 0) {
		console.error(
			`분류: ${hasEnvironmentFailure ? "실행 환경/전제조건 실패 (테스트 실패 아님)" : "실행 실패"}`,
		);
		console.error("");
		console.error("명시적 실패 이유:");
		for (const diagnostic of matchedDiagnostics) {
			console.error(`- ${diagnostic.message}`);
			if (diagnostic.help) {
				console.error(`  확인: ${diagnostic.help}`);
			}
		}
		return;
	}

	if (looksLikeTestFailure(result.output)) {
		console.error("분류: 테스트 실패");
		console.error("");
		console.error(
			"명시적 실패 이유: E2E 실행 환경은 통과했지만 테스트 assertion, timeout, 또는 테스트 본문 단계에서 실패했습니다.",
		);
		console.error("확인: 위 Playwright/Jest 로그에서 실패한 테스트 이름과 trace를 확인하세요.");
		return;
	}

	console.error("분류: 알 수 없는 실행 실패");
	console.error("");
	console.error(
		"명시적 실패 이유: 알려진 환경 실패 패턴과 테스트 실패 패턴에 매칭되지 않았습니다. 위 로그의 마지막 에러를 확인해야 합니다.",
	);
}

/**
 * 도움말을 출력합니다.
 *
 * @returns {void}
 */
function printHelp() {
	console.log(
		"사용법: node scripts/run-e2e-with-diagnostics.mjs [all|admin|api|admin-headed|admin-ui|admin-debug] [--dry-run]",
	);
	console.log("");
	console.log("예:");
	console.log("  pnpm test:e2e");
	console.log("  pnpm test:admin");
	console.log("  pnpm test:api:e2e");
	console.log("  pnpm test:e2e:headed");
}

const options = parseArgs(process.argv.slice(2));

if (options.help) {
	printHelp();
	process.exit(0);
}

const selectedSteps = getStepsForMode(options.mode);

if (options.dryRun) {
	for (const step of selectedSteps) {
		const [bin, args] = step.command;
		console.log(`${step.label}: ${[bin, ...args].join(" ")}`);
	}
	process.exit(0);
}

for (const step of selectedSteps) {
	const [bin, args] = step.command;
	console.log("");
	console.log(`▶ ${step.label} 실행: ${[bin, ...args].join(" ")}`);
	const result = await runStep(step);

	if (result.status !== 0 || result.signal) {
		printFailureSummary(step, result);
		process.exit(result.status || 1);
	}
}

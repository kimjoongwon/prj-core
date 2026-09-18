#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { isAbsolute, join, relative, resolve } from "node:path";

const repositoryRoot = resolve(import.meta.dirname, "..");
const removalPathsFile = join(
	repositoryRoot,
	"docs/public-release/filter-repo-paths.txt",
);

function run(command, commandArguments, options = {}) {
	return spawnSync(command, commandArguments, {
		cwd: options.cwd ?? repositoryRoot,
		encoding: "utf8",
		stdio: options.stdio ?? "pipe",
	});
}

function fail(message) {
	console.error(message);
	process.exit(1);
}

function requireCommand(command) {
	const commandCheck = run("sh", [
		"-c",
		`command -v "$1"`,
		"public-release",
		command,
	]);
	if (commandCheck.status !== 0) fail(`${command} 명령이 필요합니다.`);
}

function assertRotationAndRewritePrerequisites() {
	if (process.env.PUBLIC_RELEASE_ROTATION_CONFIRMED !== "true") {
		fail(
			"자격증명 폐기·재발급 완료 확인이 없습니다. PUBLIC_RELEASE_ROTATION_CONFIRMED=true가 필요합니다.",
		);
	}
	requireCommand("git-filter-repo");
	const worktreeStatus = run("git", ["status", "--porcelain"]);
	if (worktreeStatus.status !== 0 || worktreeStatus.stdout.trim()) {
		fail(
			"이력 정화 전 작업 트리가 clean이어야 합니다. 현재 변경을 먼저 별도 커밋·백업하십시오.",
		);
	}
	if (!existsSync(removalPathsFile))
		fail("filter-repo 제거 경로 파일이 없습니다.");
	console.log(
		"이력 정화 사전 조건 통과: 자격증명 회전 확인, clean worktree, git-filter-repo, 제거 경로",
	);
}

function countRefs(refPrefix) {
	const refResult = run("git", [
		"for-each-ref",
		"--format=%(refname)",
		refPrefix,
	]);
	if (refResult.status !== 0) fail("Git ref를 검사할 수 없습니다.");
	return refResult.stdout.trim()
		? refResult.stdout.trim().split("\n").length
		: 0;
}

function reportHistoryPrecheck() {
	const configuredPaths = readFileSync(removalPathsFile, "utf8")
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter((line) => line && !line.startsWith("#"));
	const matchedPaths = new Set();
	for (const configuredPath of configuredPaths) {
		const pathHistory = run("git", [
			"log",
			"--all",
			"-1",
			"--format=%H",
			"--",
			configuredPath,
		]);
		if (pathHistory.status !== 0)
			fail("Git 전체 이력의 경로를 검사할 수 없습니다.");
		if (pathHistory.stdout.trim()) matchedPaths.add(configuredPath);
	}
	console.log(
		`비파괴 사전검사: branches=${countRefs("refs/heads")}, tags=${countRefs("refs/tags")}, 제거 대상 경로=${matchedPaths.size}/${configuredPaths.length}`,
	);
	console.log(
		"경로 내용과 비밀값은 출력하지 않았습니다. 실제 정화는 docs/public-release/history-rewrite.md를 따르십시오.",
	);
}

function assertFreshClone(clonePathArgument) {
	if (!clonePathArgument) fail("fresh clone의 절대 경로가 필요합니다.");
	if (!isAbsolute(clonePathArgument))
		fail("fresh clone 경로는 절대 경로여야 합니다.");
	const clonePath = resolve(clonePathArgument);
	if (
		clonePath === repositoryRoot ||
		relative(repositoryRoot, clonePath) === ""
	) {
		fail("현재 작업 저장소는 fresh clone 검사 대상으로 사용할 수 없습니다.");
	}
	if (!existsSync(join(clonePath, ".git")))
		fail("검사 대상이 Git clone이 아닙니다.");
	const statusResult = run("git", ["status", "--porcelain"], {
		cwd: clonePath,
	});
	if (statusResult.status !== 0 || statusResult.stdout.trim())
		fail("fresh clone 작업 트리가 clean하지 않습니다.");
	return clonePath;
}

function runRedactedGitleaksScan(targetRepository) {
	requireCommand("gitleaks");
	const reportDirectory = mkdtempSync(join(tmpdir(), "prj-core-gitleaks-"));
	const reportPath = join(reportDirectory, "report.json");
	try {
		const scanResult = run(
			"gitleaks",
			[
				"git",
				"--redact",
				"--log-opts=--all",
				"--report-format=json",
				`--report-path=${reportPath}`,
				targetRepository,
			],
			{ cwd: targetRepository },
		);
		if (scanResult.status === 0) {
			console.log("gitleaks 전체 이력 검사 통과");
			return;
		}
		let findingCount = "알 수 없음";
		if (existsSync(reportPath)) {
			try {
				const report = JSON.parse(readFileSync(reportPath, "utf8"));
				if (Array.isArray(report)) findingCount = String(report.length);
			} catch {
				// 보고서 내용이나 비밀값은 출력하지 않고 실패만 전달합니다.
			}
		}
		fail(
			`gitleaks 검사 실패(findings=${findingCount}). 상세 비밀값은 출력하지 않았습니다.`,
		);
	} finally {
		rmSync(reportDirectory, { recursive: true, force: true });
	}
}

const [command = "precheck", clonePathArgument] = process.argv.slice(2);
if (command === "precheck") {
	reportHistoryPrecheck();
} else if (command === "rewrite-precheck") {
	assertRotationAndRewritePrerequisites();
} else if (command === "scan-current") {
	runRedactedGitleaksScan(repositoryRoot);
} else if (command === "scan-fresh-clone") {
	runRedactedGitleaksScan(assertFreshClone(clonePathArgument));
} else {
	fail(`지원하지 않는 명령: ${command}`);
}

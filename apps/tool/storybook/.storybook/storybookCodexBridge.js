import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";

const CAPABILITIES_PATH = "/__codex/capabilities";
const JOBS_PATH = "/__codex/jobs";
const TARGET_FILE_PREFIXES = [
	"apps/admin/web/src/app/",
	"apps/idp/web/src/app/",
	"packages/fe-ui/src/screen/",
];
const FINAL_JOB_STATUSES = new Set(["ready", "failed", "published"]);
const jobs = new Map();

function normalizeSlashes(value) {
	return value.replaceAll("\\", "/");
}

function buildRequestUrl(request) {
	const host = request.headers.host || "localhost:6006";
	return new URL(request.url || "/", `http://${host}`);
}

function sendJson(response, statusCode, body) {
	response.statusCode = statusCode;
	response.setHeader("Content-Type", "application/json; charset=utf-8");
	response.end(JSON.stringify(body));
}

async function parseJsonBody(request) {
	return new Promise((resolvePromise, rejectPromise) => {
		const chunks = [];

		request.on("data", (chunk) => {
			chunks.push(Buffer.from(chunk));
		});
		request.on("end", () => {
			try {
				const payload = Buffer.concat(chunks).toString("utf8").trim();
				resolvePromise(payload ? JSON.parse(payload) : {});
			} catch (error) {
				rejectPromise(error);
			}
		});
		request.on("error", rejectPromise);
	});
}

function readSummaryFile(summaryPath) {
	if (!summaryPath || !existsSync(summaryPath)) {
		return null;
	}

	const content = readFileSync(summaryPath, "utf8").trim();
	return content.length > 0 ? content : null;
}

function createOutputParser(onLine) {
	let buffer = "";

	return {
		push(chunk) {
			buffer += chunk.toString("utf8");
			const lines = buffer.split(/\r?\n/);
			buffer = lines.pop() ?? "";
			for (const line of lines) {
				const normalizedLine = line.trim();
				if (normalizedLine) {
					onLine(normalizedLine);
				}
			}
		},
		flush() {
			const normalizedLine = buffer.trim();
			if (normalizedLine) {
				onLine(normalizedLine);
			}
			buffer = "";
		},
	};
}

async function runCommand(command, args, options = {}) {
	return new Promise((resolvePromise, rejectPromise) => {
		const child = spawn(command, args, {
			cwd: options.cwd,
			env: options.env ?? process.env,
			stdio: ["ignore", "pipe", "pipe"],
		});
		let stdout = "";
		let stderr = "";

		child.stdout.on("data", (chunk) => {
			stdout += chunk.toString("utf8");
		});
		child.stderr.on("data", (chunk) => {
			stderr += chunk.toString("utf8");
		});
		child.on("error", rejectPromise);
		child.on("close", (code) => {
			if (code === 0) {
				resolvePromise({ stdout, stderr });
				return;
			}

			rejectPromise(
				new Error(
					stderr.trim() ||
						stdout.trim() ||
						`${command} ${args.join(" ")} exited with code ${code ?? 1}.`,
				),
			);
		});
	});
}

async function runStreamingCommand(command, args, options = {}) {
	return new Promise((resolvePromise, rejectPromise) => {
		const child = spawn(command, args, {
			cwd: options.cwd,
			env: options.env ?? process.env,
			stdio: ["ignore", "pipe", "pipe"],
		});
		let stdout = "";
		let stderr = "";
		const stdoutParser = createOutputParser((line) => {
			stdout += `${line}\n`;
			options.onStdout?.(line);
		});
		const stderrParser = createOutputParser((line) => {
			stderr += `${line}\n`;
			options.onStderr?.(line);
		});

		child.stdout.on("data", (chunk) => {
			stdoutParser.push(chunk);
		});
		child.stderr.on("data", (chunk) => {
			stderrParser.push(chunk);
		});
		child.on("error", rejectPromise);
		child.on("close", (code) => {
			stdoutParser.flush();
			stderrParser.flush();

			if (code === 0) {
				resolvePromise({ stdout, stderr });
				return;
			}

			rejectPromise(
				new Error(
					stderr.trim() ||
						stdout.trim() ||
						`${command} ${args.join(" ")} exited with code ${code ?? 1}.`,
				),
			);
		});
	});
}

function buildCapabilityReason({
	codexVersion,
	ghVersion,
	ghAuthenticated,
	originUrl,
}) {
	if (!codexVersion) {
		return "`codex` CLI를 찾지 못했습니다.";
	}
	if (!ghVersion) {
		return "`gh` CLI를 찾지 못했습니다.";
	}
	if (!ghAuthenticated) {
		return "`gh auth status`가 실패했습니다.";
	}
	if (!originUrl) {
		return "`origin` remote를 찾지 못했습니다.";
	}

	return null;
}

async function detectCapabilities(repositoryRoot) {
	const [codexResult, ghResult, ghAuthResult, originResult] = await Promise.all([
		runCommand("codex", ["--version"]).catch(() => null),
		runCommand("gh", ["--version"]).catch(() => null),
		runCommand("gh", ["auth", "status"]).catch(() => null),
		runCommand("git", ["-C", repositoryRoot, "remote", "get-url", "origin"]).catch(
			() => null,
		),
	]);
	const codexVersion = codexResult?.stdout.trim() || null;
	const ghVersion = ghResult?.stdout.split(/\r?\n/)[0]?.trim() || null;
	const ghAuthenticated = Boolean(ghAuthResult);
	const originUrl = originResult?.stdout.trim() || null;
	const reason = buildCapabilityReason({
		codexVersion,
		ghVersion,
		ghAuthenticated,
		originUrl,
	});

	return {
		available: reason === null,
		codexVersion,
		editableTargets: ["spec"],
		ghAuthenticated,
		ghVersion,
		mode: "local-only",
		originUrl,
		publishBase: "main",
		reason,
	};
}

export function sanitizeCodexTargetFile(targetFile, repositoryRoot) {
	if (typeof targetFile !== "string" || targetFile.trim().length === 0) {
		return null;
	}

	const normalizedTarget = normalizeSlashes(targetFile.trim());
	if (normalizedTarget.startsWith("/") || normalizedTarget.includes("../")) {
		return null;
	}
	if (!normalizedTarget.endsWith(".spec.md")) {
		return null;
	}

	const absolutePath = resolve(repositoryRoot, normalizedTarget);
	const relativePath = normalizeSlashes(relative(repositoryRoot, absolutePath));
	if (relativePath.startsWith("../") || relativePath === "..") {
		return null;
	}
	if (!TARGET_FILE_PREFIXES.some((prefix) => relativePath.startsWith(prefix))) {
		return null;
	}

	return relativePath;
}

function validateTargetFiles(targetFiles, repositoryRoot) {
	if (!Array.isArray(targetFiles) || targetFiles.length === 0) {
		throw new Error("편집 대상 spec 파일이 없습니다.");
	}

	const normalizedTargetFiles = [];
	for (const targetFile of targetFiles) {
		const normalizedTargetFile = sanitizeCodexTargetFile(
			targetFile,
			repositoryRoot,
		);

		if (!normalizedTargetFile) {
			throw new Error(`허용되지 않은 편집 대상입니다: ${String(targetFile)}`);
		}
		if (!existsSync(resolve(repositoryRoot, normalizedTargetFile))) {
			throw new Error(`spec 파일을 찾지 못했습니다: ${normalizedTargetFile}`);
		}
		if (!normalizedTargetFiles.includes(normalizedTargetFile)) {
			normalizedTargetFiles.push(normalizedTargetFile);
		}
	}

	return normalizedTargetFiles;
}

function formatBranchDate(value) {
	const formatter = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Seoul",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
	const formattedParts = Object.fromEntries(
		formatter
			.formatToParts(value)
			.filter((part) => part.type !== "literal")
			.map((part) => [part.type, part.value]),
	);

	return [
		formattedParts.year,
		formattedParts.month,
		formattedParts.day,
		formattedParts.hour,
		formattedParts.minute,
	].join("");
}

export function createCodexBranchName(componentName, now = new Date()) {
	const slug = String(componentName || "story")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "")
		.slice(0, 48);

	return `docs/storybook-codex/${slug || "story"}-${formatBranchDate(now)}`;
}

export function buildCodexExecutionPrompt({
	componentName,
	instruction,
	storyId,
	storyTitle,
	targetFiles,
}) {
	return `You are editing PLATE Storybook planning documents.

Context
- Story title: ${storyTitle}
- Story id: ${storyId}
- Component: ${componentName}

Allowed files
${targetFiles.map((targetFile) => `- ${targetFile}`).join("\n")}

Rules
- Modify only the allowed files above.
- Do not create, delete, move, or rename files.
- Keep the changes focused on the user's request.
- Every edited spec file must update its \`## 변경 이력\` table with today's change and author \`codex\`.
- If the request cannot be completed inside the allowed files, explain that in the final response and stop.

User instruction
${instruction}`.trim();
}

function parsePorcelainPath(line) {
	const payload = line.slice(3);
	if (payload.includes(" -> ")) {
		return payload.split(" -> ").pop()?.trim() || payload.trim();
	}

	return payload.trim();
}

export function collectAllowedJobChanges(porcelainOutput, allowedFiles) {
	const allowedFileSet = new Set(allowedFiles);
	const invalidFiles = [];
	const touchedFiles = [];
	const unsupportedChanges = [];

	for (const rawLine of porcelainOutput.split(/\r?\n/)) {
		const line = rawLine.trimEnd();
		if (!line) {
			continue;
		}

		const status = line.slice(0, 2);
		const path = normalizeSlashes(parsePorcelainPath(line));
		if (!allowedFileSet.has(path)) {
			invalidFiles.push(path);
			continue;
		}

		if (status === " M" || status === "M " || status === "MM") {
			touchedFiles.push(path);
			continue;
		}

		unsupportedChanges.push(`${status}:${path}`);
	}

	return {
		invalidFiles,
		touchedFiles: [...new Set(touchedFiles)],
		unsupportedChanges,
	};
}

function serializeJob(job) {
	return {
		branchName: job.branchName,
		componentName: job.componentName,
		createdAt: job.createdAt,
		id: job.id,
		instruction: job.instruction,
		logs: job.logs,
		prUrl: job.prUrl,
		status: job.status,
		storyId: job.storyId,
		storyTitle: job.storyTitle,
		summary: job.summary,
		targetFiles: job.targetFiles,
		touchedFiles: job.touchedFiles,
		warnings: job.warnings,
	};
}

function broadcastJob(job) {
	const payload = JSON.stringify({
		type: "snapshot",
		job: serializeJob(job),
	});
	job.events.push(payload);
	if (job.events.length > 100) {
		job.events.shift();
	}
	for (const client of job.clients) {
		client.write(`data: ${payload}\n\n`);
	}
}

function appendJobLog(job, message, stream = "info") {
	if (!message) {
		return;
	}

	job.logs.push({
		createdAt: new Date().toISOString(),
		id: randomUUID(),
		message,
		stream,
	});
	if (job.logs.length > 200) {
		job.logs.shift();
	}
	broadcastJob(job);
}

function addJobWarning(job, warning) {
	if (!warning || job.warnings.includes(warning)) {
		return;
	}

	job.warnings.push(warning);
	broadcastJob(job);
}

function setJobStatus(job, status) {
	job.status = status;
	broadcastJob(job);
}

async function resolveBaseRef(repositoryRoot) {
	for (const candidate of ["origin/main", "main"]) {
		try {
			await runCommand("git", [
				"-C",
				repositoryRoot,
				"rev-parse",
				"--verify",
				candidate,
			]);
			return candidate;
		} catch {
			// try next candidate
		}
	}

	throw new Error("`origin/main` 또는 `main` ref를 찾지 못했습니다.");
}

async function ensureWorktreeDirectory(job, repositoryRoot) {
	const worktreePath = mkdtempSync(join(tmpdir(), "plate-storybook-codex-"));
	const baseRef = await resolveBaseRef(repositoryRoot);

	await runCommand("git", [
		"-C",
		repositoryRoot,
		"worktree",
		"add",
		"--detach",
		worktreePath,
		baseRef,
	]);

	for (const targetFile of job.targetFiles) {
		const sourcePath = resolve(repositoryRoot, targetFile);
		const destinationPath = resolve(worktreePath, targetFile);
		mkdirSync(dirname(destinationPath), { recursive: true });
		writeFileSync(destinationPath, readFileSync(sourcePath, "utf8"), "utf8");
	}

	job.baseRef = baseRef;
	job.worktreePath = worktreePath;
}

async function cleanupJobWorktree(job, repositoryRoot) {
	if (!job.worktreePath) {
		return;
	}

	const worktreePath = job.worktreePath;
	job.worktreePath = null;

	try {
		await runCommand("git", [
			"-C",
			repositoryRoot,
			"worktree",
			"remove",
			"--force",
			worktreePath,
		]);
	} catch {
		rmSync(worktreePath, { force: true, recursive: true });
	}
}

async function executeCodexJob(job, repositoryRoot) {
	try {
		await ensureWorktreeDirectory(job, repositoryRoot);
		job.summaryPath = join(job.worktreePath, ".storybook-codex-summary.md");
		appendJobLog(
			job,
			`Codex를 ${job.targetFiles.length}개 spec 파일에 대해 실행합니다.`,
		);
		const prompt = buildCodexExecutionPrompt({
			componentName: job.componentName,
			instruction: job.instruction,
			storyId: job.storyId,
			storyTitle: job.storyTitle,
			targetFiles: job.targetFiles,
		});

		await runStreamingCommand(
			"codex",
			[
				"exec",
				"--full-auto",
				"--json",
				"-C",
				job.worktreePath,
				"--sandbox",
				"workspace-write",
				"-o",
				job.summaryPath,
				prompt,
			],
			{
				cwd: repositoryRoot,
				onStderr(line) {
					appendJobLog(job, line, "stderr");
				},
				onStdout(line) {
					appendJobLog(job, line, "stdout");
				},
			},
		);

		const summary = readSummaryFile(job.summaryPath);
		if (summary) {
			job.summary = summary;
		}

		const statusOutput = await runCommand("git", [
			"-C",
			job.worktreePath,
			"status",
			"--porcelain=v1",
			"--untracked-files=all",
		]);
		const changeSet = collectAllowedJobChanges(
			statusOutput.stdout,
			job.targetFiles,
		);
		job.touchedFiles = changeSet.touchedFiles;

		if (changeSet.invalidFiles.length > 0) {
			addJobWarning(
				job,
				`허용되지 않은 파일 변경이 감지되어 결과를 차단했습니다: ${changeSet.invalidFiles.join(", ")}`,
			);
			setJobStatus(job, "failed");
			await cleanupJobWorktree(job, repositoryRoot);
			return;
		}

		if (changeSet.unsupportedChanges.length > 0) {
			addJobWarning(
				job,
				`새 파일/삭제/rename 같은 비허용 변경이 감지되었습니다: ${changeSet.unsupportedChanges.join(", ")}`,
			);
			setJobStatus(job, "failed");
			await cleanupJobWorktree(job, repositoryRoot);
			return;
		}

		if (changeSet.touchedFiles.length === 0) {
			addJobWarning(job, "Codex가 허용된 spec 파일에 변경을 만들지 않았습니다.");
			await cleanupJobWorktree(job, repositoryRoot);
		}

		setJobStatus(job, "ready");
	} catch (error) {
		addJobWarning(
			job,
			error instanceof Error ? error.message : "Codex bridge 실행에 실패했습니다.",
		);
		setJobStatus(job, "failed");
		await cleanupJobWorktree(job, repositoryRoot);
	}
}

function buildPullRequestTitle(job) {
	return `docs: update ${job.componentName} planning from Storybook`;
}

function buildPullRequestBody(job) {
	return [
		"## Storybook Codex Proposal",
		"",
		`- Story: \`${job.storyTitle}\``,
		`- Story ID: \`${job.storyId}\``,
		`- Target files: ${job.touchedFiles.map((targetFile) => `\`${targetFile}\``).join(", ")}`,
		"",
		"## User Instruction",
		"",
		job.instruction,
		"",
		"## Codex Summary",
		"",
		job.summary || "No summary returned.",
		"",
		"_Generated from local Storybook Codex bridge._",
	].join("\n");
}

function extractPullRequestUrl(output) {
	const match = output.match(/https:\/\/github\.com\/\S+/);
	return match?.[0] ?? null;
}

async function publishCodexJob(job, repositoryRoot) {
	if (job.status !== "ready") {
		throw new Error("아직 PR 발행 가능한 상태가 아닙니다.");
	}
	if (!job.worktreePath || job.touchedFiles.length === 0) {
		throw new Error("발행할 변경이 없습니다.");
	}

	setJobStatus(job, "publishing");
	job.branchName = createCodexBranchName(job.componentName, new Date());
	appendJobLog(job, `Draft PR branch를 생성합니다: ${job.branchName}`);

	await runCommand("git", [
		"-C",
		job.worktreePath,
		"switch",
		"-c",
		job.branchName,
	]);
	await runCommand("git", [
		"-C",
		job.worktreePath,
		"add",
		"--",
		...job.touchedFiles,
	]);
	await runCommand("git", [
		"-C",
		job.worktreePath,
		"commit",
		"-m",
		buildPullRequestTitle(job),
	]);
	await runCommand("git", [
		"-C",
		job.worktreePath,
		"push",
		"-u",
		"origin",
		job.branchName,
	]);

	const prBodyPath = join(job.worktreePath, ".storybook-codex-pr-body.md");
	writeFileSync(prBodyPath, buildPullRequestBody(job), "utf8");
	const prResult = await runCommand(
		"gh",
		[
			"pr",
			"create",
			"--draft",
			"--base",
			"main",
			"--head",
			job.branchName,
			"--title",
			buildPullRequestTitle(job),
			"--body-file",
			prBodyPath,
		],
		{ cwd: job.worktreePath },
	);
	job.prUrl = extractPullRequestUrl(prResult.stdout);
	setJobStatus(job, "published");
	await cleanupJobWorktree(job, repositoryRoot);
}

async function handleCapabilities(response, repositoryRoot) {
	sendJson(response, 200, await detectCapabilities(repositoryRoot));
}

async function handleCreateJob(request, response, repositoryRoot) {
	const capability = await detectCapabilities(repositoryRoot);
	if (!capability.available) {
		sendJson(response, 503, capability);
		return;
	}

	let payload;
	try {
		payload = await parseJsonBody(request);
	} catch {
		sendJson(response, 400, {
			message: "JSON body를 해석하지 못했습니다.",
		});
		return;
	}

	const instruction = String(payload?.instruction || "").trim();
	if (!instruction) {
		sendJson(response, 400, {
			message: "instruction은 비어 있을 수 없습니다.",
		});
		return;
	}

	let targetFiles;
	try {
		targetFiles = validateTargetFiles(payload?.targetFiles, repositoryRoot);
	} catch (error) {
		sendJson(response, 400, {
			message: error instanceof Error ? error.message : "대상 파일 검증에 실패했습니다.",
		});
		return;
	}

	const job = {
		baseRef: null,
		branchName: null,
		clients: new Set(),
		componentName: String(payload?.componentName || "StoryPage"),
		createdAt: new Date().toISOString(),
		events: [],
		id: randomUUID(),
		instruction,
		logs: [],
		prUrl: null,
		status: "running",
		storyId: String(payload?.storyId || ""),
		storyTitle: String(payload?.storyTitle || payload?.storyId || "page story"),
		summary: null,
		summaryPath: null,
		targetFiles,
		touchedFiles: [],
		warnings: [],
		worktreePath: null,
	};
	jobs.set(job.id, job);
	broadcastJob(job);
	void executeCodexJob(job, repositoryRoot);

	sendJson(response, 202, {
		job: serializeJob(job),
		jobId: job.id,
	});
}

function handleJobEvents(request, response, jobId) {
	const job = jobs.get(jobId);
	if (!job) {
		sendJson(response, 404, { message: "job을 찾지 못했습니다." });
		return;
	}

	response.statusCode = 200;
	response.setHeader("Content-Type", "text/event-stream; charset=utf-8");
	response.setHeader("Cache-Control", "no-cache, no-transform");
	response.setHeader("Connection", "keep-alive");
	response.flushHeaders?.();
	for (const payload of job.events) {
		response.write(`data: ${payload}\n\n`);
	}
	job.clients.add(response);

	if (FINAL_JOB_STATUSES.has(job.status)) {
		response.write(`data: ${JSON.stringify({ type: "done", job: serializeJob(job) })}\n\n`);
	}

	request.on("close", () => {
		job.clients.delete(response);
		response.end();
	});
}

function handleJobResult(response, jobId) {
	const job = jobs.get(jobId);
	if (!job) {
		sendJson(response, 404, { message: "job을 찾지 못했습니다." });
		return;
	}

	sendJson(response, 200, {
		job: serializeJob(job),
	});
}

async function handlePublishJob(request, response, repositoryRoot, jobId) {
	const job = jobs.get(jobId);
	if (!job) {
		sendJson(response, 404, { message: "job을 찾지 못했습니다." });
		return;
	}

	try {
		await parseJsonBody(request).catch(() => ({}));
		await publishCodexJob(job, repositoryRoot);
		sendJson(response, 200, {
			job: serializeJob(job),
		});
	} catch (error) {
		addJobWarning(
			job,
			error instanceof Error ? error.message : "Draft PR 발행에 실패했습니다.",
		);
		if (job.status === "publishing") {
			setJobStatus(job, "ready");
		}
		sendJson(response, 500, {
			job: serializeJob(job),
			message:
				error instanceof Error
					? error.message
					: "Draft PR 발행에 실패했습니다.",
		});
	}
}

export function createStorybookCodexBridgePlugin({ repositoryRoot }) {
	return {
		apply: "serve",
		configureServer(server) {
			server.middlewares.use(async (request, response, next) => {
				const requestUrl = buildRequestUrl(request);
				const { pathname } = requestUrl;

				if (pathname === CAPABILITIES_PATH && request.method === "GET") {
					await handleCapabilities(response, repositoryRoot);
					return;
				}

				if (pathname === JOBS_PATH && request.method === "POST") {
					await handleCreateJob(request, response, repositoryRoot);
					return;
				}

				const publishMatch = pathname.match(/^\/__codex\/jobs\/([^/]+)\/publish-pr$/);
				if (publishMatch && request.method === "POST") {
					await handlePublishJob(
						request,
						response,
						repositoryRoot,
						publishMatch[1],
					);
					return;
				}

				const eventsMatch = pathname.match(/^\/__codex\/jobs\/([^/]+)\/events$/);
				if (eventsMatch && request.method === "GET") {
					handleJobEvents(request, response, eventsMatch[1]);
					return;
				}

				const resultMatch = pathname.match(/^\/__codex\/jobs\/([^/]+)\/result$/);
				if (resultMatch && request.method === "GET") {
					handleJobResult(response, resultMatch[1]);
					return;
				}

				next();
			});
		},
		name: "plate-storybook-codex-bridge",
	};
}

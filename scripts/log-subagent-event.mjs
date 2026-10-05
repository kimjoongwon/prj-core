import { appendFileSync, chmodSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const event = process.argv[2] ?? "Unknown";
const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const input = Buffer.concat(chunks).toString("utf8");

let payload;
try {
	payload = input.trim() ? JSON.parse(input) : {};
} catch {
	payload = { raw: input, parseError: true };
}

const safeSessionId =
	String(payload.session_id ?? "unknown-session")
		.replace(/[^a-zA-Z0-9._-]/g, "_")
		.slice(0, 120) || "unknown-session";
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const logDirectory =
	process.env.CODEX_AGENT_LOG_DIR ?? join(repositoryRoot, ".codex", "logs", "subagents");
const logPath = join(logDirectory, `${safeSessionId}.jsonl`);

try {
	mkdirSync(logDirectory, { recursive: true, mode: 0o700 });
	chmodSync(logDirectory, 0o700);
	appendFileSync(
		logPath,
		`${JSON.stringify({ event, loggedAt: new Date().toISOString(), payload })}\n`,
		{ encoding: "utf8", mode: 0o600 },
	);
	chmodSync(logPath, 0o600);
} catch (error) {
	console.error(`Subagent raw log warning: ${error.message}`);
}

process.stdout.write("{}\n");

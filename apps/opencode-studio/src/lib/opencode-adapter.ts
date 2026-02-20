import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

interface OpencodeContext {
	baseUrl: string;
	projectDirectory: string;
	close: () => void;
}

let contextPromise: Promise<OpencodeContext> | null = null;

function resolveProjectDirectory() {
	const envDirectory = process.env.OPENCODE_PROJECT_DIR;
	const candidates = [
		envDirectory,
		process.cwd(),
		path.resolve(process.cwd(), "../.."),
	].filter(Boolean) as string[];

	for (const candidate of candidates) {
		if (fs.existsSync(path.join(candidate, ".opencode"))) {
			return candidate;
		}
	}

	return process.cwd();
}

function startOpencodeServer() {
	const port = Number(process.env.OPENCODE_SERVER_PORT ?? 4097);
	const hostname = "127.0.0.1";
	const timeoutMs = 7000;

	const args = ["serve", `--hostname=${hostname}`, `--port=${port}`];
	const proc = spawn("opencode", args, {
		env: process.env,
	});

	return new Promise<{ url: string; close: () => void }>((resolve, reject) => {
		let output = "";
		const timeout = setTimeout(() => {
			reject(
				new Error(
					`Timeout waiting for opencode server start after ${timeoutMs}ms`,
				),
			);
		}, timeoutMs);

		const handleData = (chunk: Buffer) => {
			output += chunk.toString();
			const lines = output.split("\n");
			for (const line of lines) {
				if (!line.startsWith("opencode server listening")) {
					continue;
				}

				const match = line.match(/on\s+(https?:\/\/[^\s]+)/);
				if (!match) {
					continue;
				}

				clearTimeout(timeout);
				resolve({
					url: match[1],
					close: () => {
						proc.kill();
					},
				});
				return;
			}
		};

		proc.stdout?.on("data", handleData);
		proc.stderr?.on("data", handleData);

		proc.on("error", (error) => {
			clearTimeout(timeout);
			reject(error);
		});

		proc.on("exit", (code) => {
			clearTimeout(timeout);
			reject(
				new Error(`opencode server exited (${code ?? "unknown"})\n${output}`),
			);
		});
	});
}

export async function getOpencodeContext(): Promise<OpencodeContext> {
	if (!contextPromise) {
		contextPromise = startOpencodeServer().then((server) => ({
			baseUrl: server.url,
			projectDirectory: resolveProjectDirectory(),
			close: server.close,
		}));
	}

	return contextPromise;
}

export async function opencodeRequest<T>(input: {
	path: string;
	method?: "GET" | "POST" | "DELETE" | "PATCH";
	body?: unknown;
	directory: string;
}) {
	const context = await getOpencodeContext();
	const target = new URL(input.path, context.baseUrl);
	target.searchParams.set("directory", input.directory);

	const response = await fetch(target, {
		method: input.method ?? "GET",
		headers: { "Content-Type": "application/json" },
		body: input.body ? JSON.stringify(input.body) : undefined,
	});

	const payload = (await response.json()) as T;
	if (!response.ok) {
		throw new Error(`OpenCode request failed: ${response.status}`);
	}

	return payload;
}

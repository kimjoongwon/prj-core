import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const apiRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile() {
	const envPath = resolve(apiRoot, ".env");

	if (!existsSync(envPath)) {
		return;
	}

	for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
		const trimmedLine = line.trim();

		if (!trimmedLine || trimmedLine.startsWith("#")) {
			continue;
		}

		const separatorIndex = trimmedLine.indexOf("=");
		if (separatorIndex < 0) {
			continue;
		}

		const key = trimmedLine.slice(0, separatorIndex).trim();
		const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
		const value = rawValue.replace(/^["']|["']$/g, "");

		if (!process.env[key]) {
			process.env[key] = value;
		}
	}
}

function getE2eDatabaseUrl() {
	const explicitDatabaseUrl =
		process.env.E2E_DATABASE_URL ?? process.env.TEST_DATABASE_URL;

	if (explicitDatabaseUrl) {
		return explicitDatabaseUrl;
	}

	if (process.env.ALLOW_E2E_DB_RESET === "1" && process.env.DATABASE_URL) {
		return process.env.DATABASE_URL;
	}

	throw new Error(
		"E2E_DATABASE_URL or TEST_DATABASE_URL is required for core-api start:e2e.",
	);
}

function getOrigin(url) {
	if (!url) {
		return undefined;
	}

	return new URL(url).origin;
}

function applyOidcAdminEnv() {
	const adminOrigin = getOrigin(process.env.E2E_ADMIN_BASE_URL);

	if (!adminOrigin) {
		return;
	}

	process.env.OIDC_ADMIN_BASE_URL = adminOrigin;
	process.env.OIDC_ADMIN_REDIRECT_URI = `${adminOrigin}/api/v1/auth/callback?clientId=admin-web`;
	process.env.OIDC_ADMIN_LOGIN_URL = `${adminOrigin}/admin/auth/login`;
	process.env.OIDC_ADMIN_DEFAULT_RETURN_TO = `${adminOrigin}/admin/dashboard`;
	process.env.OIDC_ISSUER = adminOrigin;
}

loadEnvFile();
applyOidcAdminEnv();

const databaseUrl = getE2eDatabaseUrl();

process.env.DATABASE_URL = databaseUrl;
process.env.DIRECT_URL =
	process.env.E2E_DIRECT_URL ??
	process.env.TEST_DIRECT_URL ??
	process.env.DIRECT_URL ??
	databaseUrl;
process.env.NODE_ENV = "test";
process.env.ENABLE_NEST_DEVTOOLS = "false";
process.env.APP_PORT =
	process.env.CORE_API_PORT ?? process.env.APP_PORT ?? "3006";
process.env.SMTP_SECURE = process.env.SMTP_SECURE ?? "false";

const child = spawn(
	"pnpm",
	[
		"exec",
		"nest",
		"build",
		"--webpack",
		"--webpackPath",
		"webpack.config.js",
		"--watch",
	],
	{
		cwd: apiRoot,
		env: process.env,
		stdio: "inherit",
	},
);

let isShuttingDown = false;

function stopChild(signal) {
	if (isShuttingDown) {
		return;
	}

	isShuttingDown = true;
	child.kill(signal);
}

process.on("SIGINT", () => stopChild("SIGINT"));
process.on("SIGTERM", () => stopChild("SIGTERM"));

child.on("exit", (code, signal) => {
	if (signal) {
		process.exit(1);
		return;
	}

	process.exit(code ?? 0);
});

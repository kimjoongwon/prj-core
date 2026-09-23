import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const apiRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_E2E_DATABASE_NAME = "plate_e2e";

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

	if (process.env.DATABASE_URL) {
		return toDefaultE2eDatabaseUrl(process.env.DATABASE_URL);
	}

	throw new Error(
		"E2E_DATABASE_URL, TEST_DATABASE_URL, or DATABASE_URL is required for idp-api start:e2e.",
	);
}

function toDefaultE2eDatabaseUrl(databaseUrl) {
	const parsedUrl = new URL(databaseUrl);
	const databaseName = decodeURIComponent(
		parsedUrl.pathname.replace(/^\//, ""),
	);

	if (!databaseName) {
		throw new Error("DATABASE_URL must include a database name.");
	}

	parsedUrl.pathname = `/${encodeURIComponent(DEFAULT_E2E_DATABASE_NAME)}`;
	return parsedUrl.toString();
}

function getOrigin(url) {
	if (!url) {
		return undefined;
	}

	return new URL(url).origin;
}

/**
 * e2e 세션의 인증 토폴로지를 맞춘다 — 발급자(issuer)와 로그인 UI는 둘 다
 * idp-web origin, admin-web 클라이언트의 redirect/login/return URL은 admin
 * origin으로 보정한다(runtime-managed 클라이언트 설정).
 */
function applyOidcE2eEnv() {
	const idpWebOrigin = getOrigin(
		process.env.E2E_IDP_WEB_BASE_URL ?? "http://localhost:3008",
	);
	const adminOrigin = getOrigin(process.env.E2E_ADMIN_BASE_URL);

	process.env.OIDC_ISSUER = idpWebOrigin;
	process.env.OIDC_INTERACTION_BASE_URL = idpWebOrigin;

	if (!adminOrigin) {
		return;
	}

	process.env.OIDC_ADMIN_BASE_URL = adminOrigin;
	process.env.OIDC_ADMIN_REDIRECT_URI = `${adminOrigin}/api/v1/auth/callback?clientId=admin-web`;
	process.env.OIDC_ADMIN_LOGIN_URL = `${adminOrigin}/admin/auth/login`;
	process.env.OIDC_ADMIN_DEFAULT_RETURN_TO = `${adminOrigin}/admin/dashboard`;
}

loadEnvFile();
applyOidcE2eEnv();

// start.sh가 dev 세션에 내려주는 공통 런타임 기본값 — idp .env에는 시크릿만
// 있어서 e2e 단독 기동 시 config 검증이 실패한다.
process.env.AUTH_JWT_TOKEN_EXPIRES_IN ??= "10d";
process.env.AUTH_JWT_TOKEN_REFRESH_IN ??= "7d";
process.env.CORS_ENABLED ??= "true";

const databaseUrl = getE2eDatabaseUrl();

process.env.DATABASE_URL = databaseUrl;
process.env.DIRECT_URL =
	process.env.E2E_DIRECT_URL ?? process.env.TEST_DIRECT_URL ?? databaseUrl;
process.env.NODE_ENV = "test";
process.env.ENABLE_NEST_DEVTOOLS = "false";
process.env.APP_PORT =
	process.env.IDP_API_PORT ?? process.env.APP_PORT ?? "3007";
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

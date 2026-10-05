import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { config } from "dotenv";
import { Client } from "pg";

const packageRoot = resolve(__dirname, "..");
const DEFAULT_E2E_DATABASE_NAME = "plate_e2e";

config({ path: resolve(packageRoot, ".env") });

function getDatabaseName(databaseUrl: string): string {
	try {
		const parsedUrl = new URL(databaseUrl);
		return decodeURIComponent(parsedUrl.pathname.replace(/^\//, ""));
	} catch {
		throw new Error("E2E database URL is not a valid URL.");
	}
}

function toDefaultE2eDatabaseUrl(databaseUrl: string): string {
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

function isSafeE2eDatabaseName(databaseName: string): boolean {
	const normalized = databaseName.toLowerCase();
	return normalized.includes("e2e") || normalized.includes("test");
}

function getOrigin(url: string | undefined): string | undefined {
	if (!url) {
		return undefined;
	}

	return new URL(url).origin;
}

function buildOidcAdminEnv() {
	const adminOrigin = getOrigin(process.env.E2E_ADMIN_BASE_URL);

	if (!adminOrigin) {
		return {};
	}

	return {
		OIDC_ADMIN_BASE_URL: adminOrigin,
		OIDC_ADMIN_REDIRECT_URI: `${adminOrigin}/api/v1/auth/callback?clientId=admin-web`,
		OIDC_ADMIN_LOGIN_URL: `${adminOrigin}/admin/auth/login`,
		OIDC_ADMIN_DEFAULT_RETURN_TO: `${adminOrigin}/admin/dashboard`,
		OIDC_ISSUER: adminOrigin,
	};
}

function assertSafeE2eDatabase(databaseUrl: string): void {
	const databaseName = getDatabaseName(databaseUrl).toLowerCase();
	const isProductionLike =
		databaseName.includes("prod") || databaseName.includes("stage");
	const allowExplicitReset = process.env.ALLOW_E2E_DB_RESET === "1";

	if (isProductionLike && !allowExplicitReset) {
		throw new Error(
			`Refusing to reset production-like database "${databaseName}".`,
		);
	}

	if (!isSafeE2eDatabaseName(databaseName) && !allowExplicitReset) {
		throw new Error(
			[
				`Refusing to reset database "${databaseName}".`,
				"Set E2E_DATABASE_URL or TEST_DATABASE_URL to a database name containing e2e/test.",
				"Use ALLOW_E2E_DB_RESET=1 only for an intentionally disposable database.",
			].join(" "),
		);
	}
}

function resolveE2eDatabaseUrl(): { databaseUrl: string; source: string } {
	const explicitDatabaseUrl =
		process.env.E2E_DATABASE_URL ?? process.env.TEST_DATABASE_URL;

	if (explicitDatabaseUrl) {
		return { databaseUrl: explicitDatabaseUrl, source: "explicit e2e env" };
	}

	if (process.env.DATABASE_URL) {
		return {
			databaseUrl: toDefaultE2eDatabaseUrl(process.env.DATABASE_URL),
			source: `DATABASE_URL with ${DEFAULT_E2E_DATABASE_NAME}`,
		};
	}

	throw new Error(
		"E2E_DATABASE_URL, TEST_DATABASE_URL, or DATABASE_URL is required.",
	);
}

function quoteIdentifier(value: string): string {
	return `"${value.replace(/"/g, '""')}"`;
}

async function ensureE2eDatabaseExists(databaseUrl: string): Promise<void> {
	const databaseName = getDatabaseName(databaseUrl);
	const adminUrl = new URL(databaseUrl);
	adminUrl.pathname = "/postgres";

	const client = new Client({ connectionString: adminUrl.toString() });

	try {
		await client.connect();
		const result = await client.query<{ exists: boolean }>(
			"select exists(select 1 from pg_database where datname = $1) as exists",
			[databaseName],
		);

		if (result.rows[0]?.exists) {
			return;
		}

		await client.query(`create database ${quoteIdentifier(databaseName)}`);
		console.log(`Created E2E database: ${databaseName}`);
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		throw new Error(
			[
				`E2E database "${databaseName}" does not exist and could not be created.`,
				"Create the database manually or grant CREATEDB privilege to the configured PostgreSQL user.",
				detail,
			].join(" "),
		);
	} finally {
		await client.end().catch(() => undefined);
	}
}

function runPrismaCommand(
	args: string[],
	databaseUrl: string,
	directUrl: string,
) {
	const result = spawnSync("pnpm", ["exec", "prisma", ...args], {
		cwd: packageRoot,
		env: {
			...process.env,
			...buildOidcAdminEnv(),
			DATABASE_URL: databaseUrl,
			DIRECT_URL: directUrl,
			NODE_ENV: "test",
			PRISMA_SEED_PROFILE: "e2e",
			// E2E uses a deterministic synthetic identity at this process boundary;
			// normal bootstrap still requires caller-provided credentials.
			LOCAL_BOOTSTRAP_ADMIN_EMAIL:
				process.env.LOCAL_BOOTSTRAP_ADMIN_EMAIL ?? "e2e-admin@example.invalid",
			LOCAL_BOOTSTRAP_ADMIN_PASSWORD:
				process.env.LOCAL_BOOTSTRAP_ADMIN_PASSWORD ?? "e2e-only-password",
			LOCAL_BOOTSTRAP_ADMIN_NAME:
				process.env.LOCAL_BOOTSTRAP_ADMIN_NAME ?? "E2E Administrator",
			LOCAL_BOOTSTRAP_ADMIN_NICKNAME:
				process.env.LOCAL_BOOTSTRAP_ADMIN_NICKNAME ?? "e2e-admin",
		},
		stdio: "inherit",
	});

	if (result.error) {
		throw result.error;
	}

	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}
}

async function main(): Promise<void> {
	const resolvedDatabase = resolveE2eDatabaseUrl();
	const databaseUrl = resolvedDatabase.databaseUrl;
	const directUrl =
		process.env.E2E_DIRECT_URL ?? process.env.TEST_DIRECT_URL ?? databaseUrl;

	if (!directUrl) {
		throw new Error(
			"E2E_DIRECT_URL, TEST_DIRECT_URL, or derived E2E database URL is required.",
		);
	}

	assertSafeE2eDatabase(databaseUrl);
	await ensureE2eDatabaseExists(databaseUrl);

	console.log(
		`Resetting seeded E2E database: ${getDatabaseName(databaseUrl)} (${resolvedDatabase.source})`,
	);
	runPrismaCommand(
		["db", "push", "--force-reset", "--accept-data-loss"],
		databaseUrl,
		directUrl,
	);
	runPrismaCommand(["db", "seed"], databaseUrl, directUrl);
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : String(error));
	process.exit(1);
});

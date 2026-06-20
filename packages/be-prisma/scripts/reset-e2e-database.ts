import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { config } from "dotenv";

const packageRoot = resolve(__dirname, "..");

config({ path: resolve(packageRoot, ".env") });

function getDatabaseName(databaseUrl: string): string {
	try {
		const parsedUrl = new URL(databaseUrl);
		return parsedUrl.pathname.replace(/^\//, "");
	} catch {
		throw new Error("E2E database URL is not a valid URL.");
	}
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
	const isNamedForE2e =
		databaseName.includes("e2e") || databaseName.includes("test");
	const isProductionLike =
		databaseName.includes("prod") || databaseName.includes("stage");
	const allowExplicitReset = process.env.ALLOW_E2E_DB_RESET === "1";

	if (isProductionLike && !allowExplicitReset) {
		throw new Error(
			`Refusing to reset production-like database "${databaseName}".`,
		);
	}

	if (!isNamedForE2e && !allowExplicitReset) {
		throw new Error(
			[
				`Refusing to reset database "${databaseName}".`,
				"Set E2E_DATABASE_URL or TEST_DATABASE_URL to a database name containing e2e/test.",
				"Use ALLOW_E2E_DB_RESET=1 only for an intentionally disposable database.",
			].join(" "),
		);
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

const explicitDatabaseUrl =
	process.env.E2E_DATABASE_URL ?? process.env.TEST_DATABASE_URL;
const databaseUrl = explicitDatabaseUrl ?? process.env.DATABASE_URL;
const directUrl =
	process.env.E2E_DIRECT_URL ?? process.env.TEST_DIRECT_URL ?? databaseUrl;

if (!databaseUrl) {
	throw new Error(
		"E2E_DATABASE_URL, TEST_DATABASE_URL, or DATABASE_URL is required.",
	);
}

if (!directUrl) {
	throw new Error(
		"E2E_DIRECT_URL, TEST_DIRECT_URL, or DIRECT_URL is required.",
	);
}

assertSafeE2eDatabase(databaseUrl);

console.log(`Resetting seeded E2E database: ${getDatabaseName(databaseUrl)}`);
runPrismaCommand(
	["db", "push", "--force-reset", "--accept-data-loss"],
	databaseUrl,
	directUrl,
);
runPrismaCommand(["db", "seed"], databaseUrl, directUrl);

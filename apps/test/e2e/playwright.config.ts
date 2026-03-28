import Module from "node:module";
import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

// 항상 절대 경로로 browsers 경로 설정 (상대 경로는 CWD에 따라 달라질 수 있음)
process.env.PLAYWRIGHT_BROWSERS_PATH =
	process.env.PLAYWRIGHT_BROWSERS_PATH ?? path.join(__dirname, "browsers");
process.env.E2E_ENV = process.env.E2E_ENV ?? "local";

const workspaceNodeModulesPath = path.join(__dirname, "node_modules");
const existingNodePath = process.env.NODE_PATH;
process.env.NODE_PATH = [workspaceNodeModulesPath, existingNodePath]
	.filter((value): value is string => Boolean(value))
	.join(path.delimiter);

// Playwright가 모노레포 바깥(out/full) 경로에서 테스트를 로드해도 workspace 의존성을 찾게 합니다.
(
	Module as typeof Module & {
		_initPaths?: () => void;
	}
)._initPaths?.();

const e2eEnvironment = process.env.E2E_ENV;
const skipAdminSetup = process.env.SKIP_ADMIN_SETUP === "1";
const e2eTarget = process.env.E2E_TARGET ?? "all";
const chromiumLaunchOptions = {
	args: ["--disable-crash-reporter"],
};
const shouldUseLocalRuntime = e2eEnvironment === "local";
const reuseExistingServer = shouldUseLocalRuntime && !process.env.CI;
const includesAdminTarget = e2eTarget === "admin" || e2eTarget === "all";
const includesIdpTarget = e2eTarget === "idp" || e2eTarget === "all";
const includesStorybookTarget =
	e2eTarget === "storybook" || e2eTarget === "all";

function ensureTrailingSlash(url: string) {
	return url.endsWith("/") ? url : `${url}/`;
}

function resolveBaseUrl(options: {
	envKey: string;
	localDefault: string;
	required: boolean;
}) {
	const configured = process.env[options.envKey];

	if (configured) {
		return ensureTrailingSlash(configured);
	}

	if (options.required) {
		throw new Error(
			`${options.envKey} is required when E2E_ENV=${e2eEnvironment}.`,
		);
	}

	return ensureTrailingSlash(options.localDefault);
}

const adminBaseUrl = resolveBaseUrl({
	envKey: "E2E_ADMIN_BASE_URL",
	localDefault: "http://localhost:3000/admin/",
	required: e2eEnvironment === "prod" && includesAdminTarget,
});
const idpBaseUrl = resolveBaseUrl({
	envKey: "E2E_IDP_BASE_URL",
	localDefault: "http://localhost:3008/",
	required: e2eEnvironment === "prod" && includesIdpTarget,
});
const coreApiBaseUrl = resolveBaseUrl({
	envKey: "E2E_CORE_API_BASE_URL",
	localDefault: "http://localhost:3006/",
	required: false,
});
const idpApiBaseUrl = resolveBaseUrl({
	envKey: "E2E_IDP_API_BASE_URL",
	localDefault: "http://localhost:3007/",
	required: false,
});
const storybookBaseUrl = resolveBaseUrl({
	envKey: "E2E_STORYBOOK_BASE_URL",
	localDefault: "http://localhost:6006/",
	required: e2eEnvironment === "prod" && includesStorybookTarget,
});

process.env.E2E_ADMIN_BASE_URL = adminBaseUrl;
process.env.E2E_IDP_BASE_URL = idpBaseUrl;
process.env.E2E_CORE_API_BASE_URL = coreApiBaseUrl;
process.env.E2E_IDP_API_BASE_URL = idpApiBaseUrl;
process.env.E2E_STORYBOOK_BASE_URL = storybookBaseUrl;

const adminAuthStorageStatePath = path.join(
	__dirname,
	"tests/admin/helpers/.auth",
	e2eEnvironment,
	"admin.json",
);

function buildApiStartCommand(
	envDir: string,
	filter: "core-api" | "idp-api",
) {
	return [
		"bash -lc",
		`'set -a; if [ -f ${envDir}/.env ]; then source ${envDir}/.env; fi; set +a; export SMTP_SECURE=\${SMTP_SECURE:-false}; pnpm --filter=${filter} start:dev'`,
	].join(" ");
}

const idpApiServer = {
	command: buildApiStartCommand("apps/idp/api", "idp-api"),
	url: new URL("/api/password-policy", idpApiBaseUrl).toString(),
	reuseExistingServer,
	timeout: 120000,
	cwd: "../../..",
};

const coreApiServer = {
	command: buildApiStartCommand("apps/core/api", "core-api"),
	url: new URL("/api-json", coreApiBaseUrl).toString(),
	reuseExistingServer,
	timeout: 120000,
	cwd: "../../..",
};

const adminWebServer = {
	command: "pnpm --filter=admin-web start:dev",
	url: new URL("/admin/auth/login", adminBaseUrl).toString(),
	reuseExistingServer,
	timeout: 120000,
	cwd: "../../..",
};

const idpWebServer = {
	command: "pnpm --filter=idp-web dev",
	url: new URL("/auth/login", idpBaseUrl).toString(),
	reuseExistingServer,
	timeout: 120000,
	cwd: "../../..",
};

const storybookServer = {
	command: "pnpm --filter=tool-storybook start:dev",
	url: new URL("/__storybook_auth/login", storybookBaseUrl).toString(),
	reuseExistingServer,
	timeout: 120000,
	cwd: "../../..",
};

function getWebServers() {
	if (e2eTarget === "admin") {
		return [coreApiServer, idpApiServer, adminWebServer, idpWebServer];
	}

	if (e2eTarget === "idp") {
		return [idpApiServer, idpWebServer];
	}

	if (e2eTarget === "storybook") {
		return [idpApiServer, idpWebServer, storybookServer];
	}

	return [
		coreApiServer,
		idpApiServer,
		adminWebServer,
		idpWebServer,
		storybookServer,
	];
}

/**
 * Playwright E2E 테스트 설정 (멀티앱, Sidecar 방식)
 *
 * 테스트 파일은 각 페이지 코드 옆에 *.e2e.ts 로 위치합니다:
 *   apps/admin/web/src/app/(admin)/templates/page.e2e.ts
 *   apps/idp/web/src/app/(console)/accounts/page.e2e.ts
 *
 * 앱별 테스트 실행:
 *   pnpm --filter=test-e2e test:admin
 *   pnpm --filter=test-e2e test:idp
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 모노레포 루트에서 *.e2e.ts 파일 탐색
  testDir: path.join(__dirname, "../../.."),
  testMatch: "**/*.e2e.ts",
  testIgnore: ["**/node_modules/**", "**/dist/**", "**/out/**"],

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 3,

  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["list"],
  ],

  // 글로벌 설정 (baseURL은 프로젝트별로 설정)
  use: {
    screenshot: "only-on-failure",
    video: "on-first-retry",
    trace: "on-first-retry",
    actionTimeout: 10000,
    navigationTimeout: 60000,
  },

  timeout: 90000,

  // 앱별 프로젝트 설정
  projects: [
    // ── Admin Auth Setup ──
    ...(!skipAdminSetup
      ? [
          {
            name: "admin-setup",
            // setup 파일은 apps/test/e2e에 계속 존재
            testMatch: "**/apps/test/e2e/tests/admin/helpers/*.setup.ts",
            use: {
              ...devices["Desktop Chrome"],
              baseURL: adminBaseUrl,
              launchOptions: chromiumLaunchOptions,
            },
          },
        ]
      : []),

    // ── Admin ──
    {
      name: "admin-chromium",
      testMatch: "**/apps/admin/web/src/**/*.e2e.ts",
      dependencies: skipAdminSetup ? [] : ["admin-setup"],
      use: {
        ...devices["Desktop Chrome"],
        baseURL: adminBaseUrl,
        launchOptions: chromiumLaunchOptions,
        storageState: adminAuthStorageStatePath,
      },
    },
    {
      name: "admin-mobile",
      testMatch: "**/apps/admin/web/src/**/*.e2e.ts",
      dependencies: skipAdminSetup ? [] : ["admin-setup"],
      use: {
        ...devices["Pixel 5"],
        baseURL: adminBaseUrl,
        launchOptions: chromiumLaunchOptions,
        storageState: adminAuthStorageStatePath,
      },
    },

    // ── IDP (Identity Provider) ──
    {
      name: "idp-chromium",
      testMatch: "**/apps/idp/web/src/**/*.e2e.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: idpBaseUrl,
      },
    },
    {
      name: "idp-mobile",
      testMatch: "**/apps/idp/web/src/**/*.e2e.ts",
      use: {
        ...devices["Pixel 5"],
        baseURL: idpBaseUrl,
      },
    },

    // ── Storybook ──
    {
      name: "storybook-chromium",
      testMatch: "**/apps/tool/storybook/**/*.e2e.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: storybookBaseUrl,
        launchOptions: chromiumLaunchOptions,
      },
    },
  ],

  // 개발 서버 설정 (SKIP_WEBSERVER=1 로 비활성화)
  webServer: process.env.SKIP_WEBSERVER || !shouldUseLocalRuntime
    ? undefined
    : getWebServers(),
});

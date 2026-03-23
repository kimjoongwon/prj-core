import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

// 항상 절대 경로로 browsers 경로 설정 (상대 경로는 CWD에 따라 달라질 수 있음)
process.env.PLAYWRIGHT_BROWSERS_PATH =
	process.env.PLAYWRIGHT_BROWSERS_PATH ?? path.join(__dirname, "browsers");

const skipAdminSetup = process.env.SKIP_ADMIN_SETUP === "1";
const e2eTarget = process.env.E2E_TARGET ?? "all";
const chromiumLaunchOptions = {
	args: ["--disable-crash-reporter"],
};

const reuseExistingServer = !process.env.CI;

function buildApiStartCommand(
	envDir: string,
	filter: "core-api" | "idp-api",
) {
	return [
		"bash -lc",
		`'set -a; if [ -f ${envDir}/.env.local ]; then source ${envDir}/.env.local; elif [ -f ${envDir}/.env ]; then source ${envDir}/.env; fi; set +a; export SMTP_SECURE=\${SMTP_SECURE:-false}; pnpm --filter=${filter} start:dev'`,
	].join(" ");
}

const idpApiServer = {
	command: buildApiStartCommand("apps/idp/api", "idp-api"),
	url: "http://localhost:3007/api/password-policy",
	reuseExistingServer,
	timeout: 120000,
	cwd: "../../..",
};

const coreApiServer = {
	command: buildApiStartCommand("apps/core/api", "core-api"),
	url: "http://localhost:3006/api-json",
	reuseExistingServer,
	timeout: 120000,
	cwd: "../../..",
};

const adminWebServer = {
	command: "pnpm --filter=admin-web start:dev",
	url: "http://localhost:3000/admin/auth/login",
	reuseExistingServer,
	timeout: 120000,
	cwd: "../../..",
};

const idpWebServer = {
	command: "pnpm --filter=idp-web dev",
	url: "http://localhost:3008/auth/login",
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

	return [coreApiServer, idpApiServer, adminWebServer, idpWebServer];
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
    navigationTimeout: 30000,
  },

  timeout: 60000,

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
              baseURL: "http://localhost:3000/admin/",
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
        baseURL: "http://localhost:3000/admin/",
        launchOptions: chromiumLaunchOptions,
        // testDir 변경으로 절대 경로 사용
        storageState: path.join(
          __dirname,
          "tests/admin/helpers/.auth/admin.json",
        ),
      },
    },
    {
      name: "admin-mobile",
      testMatch: "**/apps/admin/web/src/**/*.e2e.ts",
      dependencies: skipAdminSetup ? [] : ["admin-setup"],
      use: {
        ...devices["Pixel 5"],
        baseURL: "http://localhost:3000/admin/",
        launchOptions: chromiumLaunchOptions,
        storageState: path.join(
          __dirname,
          "tests/admin/helpers/.auth/admin.json",
        ),
      },
    },

    // ── IDP (Identity Provider) ──
    {
      name: "idp-chromium",
      testMatch: "**/apps/idp/web/src/**/*.e2e.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3008/",
      },
    },
    {
      name: "idp-mobile",
      testMatch: "**/apps/idp/web/src/**/*.e2e.ts",
      use: {
        ...devices["Pixel 5"],
        baseURL: "http://localhost:3008/",
      },
    },
  ],

  // 개발 서버 설정 (SKIP_WEBSERVER=1 로 비활성화)
  webServer: process.env.SKIP_WEBSERVER
    ? undefined
    : getWebServers(),
});

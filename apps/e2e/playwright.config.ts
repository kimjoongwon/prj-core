import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

// 항상 절대 경로로 browsers 경로 설정 (상대 경로는 CWD에 따라 달라질 수 있음)
process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(__dirname, "browsers");

/**
 * Playwright E2E 테스트 설정 (멀티앱, Sidecar 방식)
 *
 * 테스트 파일은 각 페이지 코드 옆에 *.e2e.ts 로 위치합니다:
 *   apps/admin/src/app/(admin)/templates/page.e2e.ts
 *   apps/idp-client/src/app/(console)/accounts/page.e2e.ts
 *
 * 앱별 테스트 실행:
 *   pnpm --filter=@cocrepo/e2e test:admin
 *   pnpm --filter=@cocrepo/e2e test:proposal
 *   pnpm --filter=@cocrepo/e2e test:idp
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 모노레포 루트에서 *.e2e.ts 파일 탐색
  testDir: path.join(__dirname, "../.."),
  testMatch: "**/*.e2e.ts",

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

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
    {
      name: "admin-setup",
      // setup 파일은 apps/e2e에 계속 존재
      testMatch: "**/apps/e2e/tests/admin/helpers/*.setup.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3000/admin/",
      },
    },

    // ── Admin ──
    {
      name: "admin-chromium",
      testMatch: "**/apps/admin/src/**/*.e2e.ts",
      dependencies: ["admin-setup"],
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3000/admin/",
        // testDir 변경으로 절대 경로 사용
        storageState: path.join(
          __dirname,
          "tests/admin/helpers/.auth/admin.json",
        ),
      },
    },
    {
      name: "admin-mobile",
      testMatch: "**/apps/admin/src/**/*.e2e.ts",
      dependencies: ["admin-setup"],
      use: {
        ...devices["Pixel 5"],
        baseURL: "http://localhost:3000/admin/",
        storageState: path.join(
          __dirname,
          "tests/admin/helpers/.auth/admin.json",
        ),
      },
    },

    // ── Proposal ──
    {
      name: "proposal-chromium",
      testMatch: "**/apps/proposal/src/**/*.e2e.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3001/",
      },
    },
    {
      name: "proposal-mobile",
      testMatch: "**/apps/proposal/src/**/*.e2e.ts",
      use: {
        ...devices["Pixel 5"],
        baseURL: "http://localhost:3001/",
      },
    },

    // ── IDP (Identity Provider) ──
    {
      name: "idp-chromium",
      testMatch: "**/apps/idp-client/src/**/*.e2e.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3008/",
      },
    },
    {
      name: "idp-mobile",
      testMatch: "**/apps/idp-client/src/**/*.e2e.ts",
      use: {
        ...devices["Pixel 5"],
        baseURL: "http://localhost:3008/",
      },
    },
  ],

  // 개발 서버 설정 (SKIP_WEBSERVER=1 로 비활성화)
  webServer: process.env.SKIP_WEBSERVER
    ? undefined
    : [
        {
          // IDP 서버 (인증, port 3007)
          command: "pnpm --filter=idp-server start:dev",
          url: "http://localhost:3007/api",
          reuseExistingServer: !process.env.CI,
          timeout: 120000,
          cwd: "../..",
        },
        {
          // 백엔드 API 서버 (port 3006)
          command: "pnpm --filter=server start:dev",
          url: "http://localhost:3006/api",
          reuseExistingServer: !process.env.CI,
          timeout: 120000,
          cwd: "../..",
        },
        {
          command: "pnpm --filter=admin dev",
          url: "http://localhost:3000/admin/auth/login",
          reuseExistingServer: !process.env.CI,
          timeout: 120000,
          cwd: "../..",
        },
        {
          command: "pnpm --filter=proposal start:dev",
          url: "http://localhost:3001/",
          reuseExistingServer: !process.env.CI,
          timeout: 120000,
          cwd: "../..",
        },
        {
          command: "pnpm --filter=idp-client dev",
          url: "http://localhost:3008/",
          reuseExistingServer: !process.env.CI,
          timeout: 120000,
          cwd: "../..",
        },
      ],
});

import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E 테스트 설정 (멀티앱)
 *
 * 앱별 테스트 실행:
 *   pnpm --filter=@cocrepo/e2e test:admin
 *   pnpm --filter=@cocrepo/e2e test:proposal
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",

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
    // ── Admin ──
    {
      name: "admin-chromium",
      testMatch: "**/admin/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3000/admin/",
      },
    },
    {
      name: "admin-mobile",
      testMatch: "**/admin/**/*.spec.ts",
      use: {
        ...devices["Pixel 5"],
        baseURL: "http://localhost:3000/admin/",
      },
    },

    // ── Proposal ──
    {
      name: "proposal-chromium",
      testMatch: "**/proposal/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3001/",
      },
    },
    {
      name: "proposal-mobile",
      testMatch: "**/proposal/**/*.spec.ts",
      use: {
        ...devices["Pixel 5"],
        baseURL: "http://localhost:3001/",
      },
    },
  ],

  // 개발 서버 설정 (SKIP_WEBSERVER=1 로 비활성화)
  webServer: process.env.SKIP_WEBSERVER
    ? undefined
    : [
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
      ],
});

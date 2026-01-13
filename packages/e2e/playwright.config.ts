import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E 테스트 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 테스트 파일 위치
  testDir: "./tests",

  // 테스트 파일 패턴
  testMatch: "**/*.spec.ts",

  // 병렬 실행 설정
  fullyParallel: true,

  // CI 환경에서는 재시도 2회
  retries: process.env.CI ? 2 : 0,

  // CI 환경에서는 워커 수 제한
  workers: process.env.CI ? 1 : undefined,

  // 리포터 설정
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["list"],
  ],

  // 글로벌 설정
  use: {
    // Admin 앱 기본 URL
    baseURL: "http://localhost:3000",

    // 스크린샷 (실패 시에만)
    screenshot: "only-on-failure",

    // 비디오 (실패 시에만)
    video: "on-first-retry",

    // 트레이스 (실패 시에만)
    trace: "on-first-retry",

    // 타임아웃
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  // 테스트 타임아웃 (각 테스트당)
  timeout: 60000,

  // 프로젝트별 설정 (브라우저별)
  // 현재 Chromium만 설치됨. 다른 브라우저 필요시: pnpm --filter=@cocrepo/e2e install:browsers
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // 모바일 테스트 (Chromium 기반)
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
    // 아래 브라우저들은 추가 설치 필요
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
    // {
    //   name: "mobile-safari",
    //   use: { ...devices["iPhone 12"] },
    // },
  ],

  // 개발 서버 설정 (테스트 실행 전 자동 시작)
  webServer: {
    command: "pnpm --filter=admin start:dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    cwd: "../..",
  },
});

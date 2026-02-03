import { defineConfig, devices } from "@playwright/test";

// 로컬 브라우저 경로 설정
process.env.PLAYWRIGHT_BROWSERS_PATH =
	process.env.PLAYWRIGHT_BROWSERS_PATH || "./playwright-browsers";

/**
 * Playwright E2E 테스트 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [["html", { open: "never" }]],
	use: {
		baseURL: "http://localhost:3000/admin/",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
	],
	webServer: {
		command: "pnpm start:dev",
		url: "http://localhost:3000/admin",
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
	},
});

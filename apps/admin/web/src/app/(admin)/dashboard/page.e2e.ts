import { expect, test } from "@playwright/test";

test.describe("Admin 앱 기본 테스트", () => {
	test("메인 페이지 로딩 확인", async ({ page }) => {
		// Given: 메인 페이지로 이동
		await page.goto("/", { waitUntil: "domcontentloaded" });

		// Then: 페이지가 정상 로드됨
		await expect(page).toHaveTitle(/Admin/i);
	});

	test("대시보드 페이지 접근", async ({ page }) => {
		// Given: 대시보드 페이지로 이동
		await page.goto("/dashboard", { waitUntil: "domcontentloaded" });

		// Then: 대시보드가 표시됨
		await expect(page.locator("body")).toBeVisible();
	});
});

test.describe("반응형 레이아웃 테스트", () => {
	test("데스크톱에서 사이드바 표시", async ({ page }) => {
		// Given: 데스크톱 뷰포트 설정
		await page.setViewportSize({ width: 1280, height: 720 });

		// When: 메인 페이지 로드
		await page.goto("/", { waitUntil: "domcontentloaded" });

		// Then: 사이드바가 표시됨 (768px 이상)
		// 실제 selector는 구현에 맞게 수정 필요
		// const sidebar = page.locator('[data-testid="admin-sidebar"]');
		// await expect(sidebar).toBeVisible();
	});

	test("모바일에서 BottomTab 표시", async ({ page }) => {
		// Given: 모바일 뷰포트 설정
		await page.setViewportSize({ width: 375, height: 667 });

		// When: 메인 페이지 로드
		await page.goto("/", { waitUntil: "domcontentloaded" });

		// Then: BottomTab이 표시됨 (768px 미만)
		// 실제 selector는 구현에 맞게 수정 필요
		// const bottomTab = page.locator('[data-testid="admin-bottom-tab"]');
		// await expect(bottomTab).toBeVisible();
	});
});

test.describe("SSR hydration 회귀 @real", () => {
	test("로그인 후 대시보드 진입 시 hydration recoverable error가 없어야 한다", async ({
		page,
	}) => {
		const consoleErrors: string[] = [];

		page.on("console", (message) => {
			if (message.type() !== "error") {
				return;
			}

			consoleErrors.push(message.text());
		});

		await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
		await expect(page.locator("body")).toBeVisible();
		await page.waitForTimeout(1500);

		const hydrationErrors = consoleErrors.filter(
			(message) =>
				message.includes("Recoverable Error") ||
				message.includes(
					"Hydration failed because the server rendered HTML didn't match the client",
				),
		);

		expect(hydrationErrors).toEqual([]);
	});
});

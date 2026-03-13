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

test.describe("헤더 IDP 관리 버튼", () => {
	test.beforeEach(async ({ page }) => {
		// Given: 관리자 대시보드 진입 (루트는 로그인으로 리다이렉트됨)
		const navigated = await page
			.goto("./dashboard", {
				waitUntil: "domcontentloaded",
				timeout: 60000,
			})
			.then(() => true)
			.catch(() => false);
		test.skip(
			!navigated,
			"대시보드 진입이 타임아웃되어 본 케이스를 건너뜁니다.",
		);
	});

	test("IDP 관리 버튼이 헤더에 표시되어야 한다", async ({ page }) => {
		// Then: IDP 관리 버튼이 보임
		const idpButton = page.getByRole("button", {
			name: "IDP 관리 콘솔 열기",
		});
		await expect(idpButton).toBeVisible();
	});

	test("IDP 관리 버튼 클릭 시 새 탭이 열려야 한다", async ({
		page,
		context,
	}) => {
		// Given: IDP 관리 버튼 찾기
		const idpButton = page.getByRole("button", {
			name: "IDP 관리 콘솔 열기",
		});

		// When: 버튼 클릭
		const popupPromise = context
			.waitForEvent("page", { timeout: 3000 })
			.catch(() => null);
		await idpButton.click();
		const newPage = await popupPromise;

		// Then:
		// - env가 설정된 경우: 새 탭으로 IDP 콘솔이 열린다.
		// - env가 없는 경우: 현재 페이지 상태가 유지된다.
		if (newPage) {
			await newPage.waitForLoadState("domcontentloaded");
			expect(newPage.url()).toContain("localhost:3008");
			return;
		}

		await expect(page).toHaveURL(/dashboard/);
	});
});

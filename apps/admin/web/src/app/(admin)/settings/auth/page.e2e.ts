import { loginToConsole } from "@cocrepo/e2e";
import { expect, test } from "@playwright/test";

test.describe("IDP 대시보드", () => {
	test.describe("페이지 렌더링", () => {
		test.beforeEach(async ({ page }) => {
			// Given: 로그인 후 대시보드 진입
			await loginToConsole(page);
			await page.goto("./settings/auth");
			await page.waitForLoadState("networkidle");
		});

		test("페이지 타이틀이 표시되어야 한다", async ({ page }) => {
			// Then: 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "대시보드" }),
			).toBeVisible();
			await expect(
				page.getByText("IDP 인증 시스템 현황을 한눈에 확인합니다"),
			).toBeVisible();
		});

		test("통계 카드가 표시되어야 한다", async ({ page }) => {
			// Then: 6개 통계 카드 라벨 확인
			await expect(page.getByText("활성 세션")).toBeVisible();
			await expect(page.getByText("오늘 성공")).toBeVisible();
			await expect(page.getByText("오늘 실패")).toBeVisible();
			await expect(page.getByText("오늘 잠금")).toBeVisible();
			await expect(page.getByText("잠금 계정")).toBeVisible();
			await expect(page.getByText("활성 클라이언트")).toBeVisible();
		});

		test("로그인 추이 차트 섹션이 표시되어야 한다", async ({ page }) => {
			// Then: 차트 섹션 확인
			await expect(page.getByText("최근 7일 로그인 추이")).toBeVisible();
		});
	});

	test.describe("설정 라우트", () => {
		test("/settings/auth 접속 시 인증 대시보드를 유지해야 한다", async ({
			page,
		}) => {
			await loginToConsole(page);
			await page.goto("./settings/auth");
			await expect(page).toHaveURL(/\/settings\/auth/);
		});
	});
});

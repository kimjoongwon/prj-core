import { test, expect } from "@playwright/test";
import { loginToConsole } from "../helpers/login";

test.describe("IDP 대시보드", () => {
	test.describe("페이지 렌더링", () => {
		test.beforeEach(async ({ page }) => {
			// Given: 로그인 후 대시보드 진입
			await loginToConsole(page);
			await page.goto("/dashboard");
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

	test.describe("루트 리다이렉트", () => {
		test("/ 접속 시 /dashboard로 리다이렉트되어야 한다", async ({
			page,
		}) => {
			// Given: 로그인 후
			await loginToConsole(page);

			// When: 루트 경로 접속
			await page.goto("/");

			// Then: /dashboard로 리다이렉트
			await expect(page).toHaveURL(/\/dashboard/);
		});
	});
});

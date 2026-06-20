import { expect, test } from "@playwright/test";

test.describe("비밀번호 재설정", () => {
	test.describe("만료된 토큰", () => {
		test("만료된 토큰으로 접근 시 만료 안내가 표시되어야 한다", async ({
			page,
		}) => {
			// Given: 유효하지 않은 토큰으로 페이지 진입
			await page.goto("./auth/reset-password/invalid-token-12345");

			// Then: 만료/무효 안내 화면 표시
			await expect(
				page.getByText(/링크가 만료되었습니다|유효하지 않은 링크/),
			).toBeVisible({ timeout: 10000 });
		});

		test("만료 시 다시 요청하기 버튼이 표시되어야 한다", async ({ page }) => {
			// Given: 유효하지 않은 토큰으로 접근
			await page.goto("./auth/reset-password/expired-token-xyz");

			// Then: 다시 요청하기 버튼이 forgot-password로 링크됨
			await expect(
				page.getByRole("button", { name: "다시 요청하기" }),
			).toBeVisible({ timeout: 10000 });
		});
	});
});

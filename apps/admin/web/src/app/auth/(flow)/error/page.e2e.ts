import { expect, test } from "@playwright/test";

test.describe("OIDC 에러 페이지", () => {
	test.describe("에러 표시", () => {
		test("에러 파라미터가 표시되어야 한다", async ({ page }) => {
			// Given: 에러 파라미터와 함께 에러 페이지 진입
			await page.goto(
				"./auth/error?error=invalid_request&error_description=The+request+is+missing+a+required+parameter",
			);

			// Then: 에러 정보가 표시됨
			await expect(page.getByText("오류 발생")).toBeVisible();
			await expect(page.getByText("invalid_request")).toBeVisible();
		});

		test("에러 설명이 표시되어야 한다", async ({ page }) => {
			// Given: 에러 + 설명 파라미터
			await page.goto(
				"./auth/error?error=access_denied&error_description=The+user+denied+access",
			);

			// Then: 에러 코드와 설명이 표시됨
			await expect(page.getByText("access_denied")).toBeVisible();
			await expect(page.getByText("The user denied access")).toBeVisible();
		});
	});

	test.describe("네비게이션", () => {
		test("돌아가기 버튼이 표시되어야 한다", async ({ page }) => {
			// Given: 에러 페이지 진입
			await page.goto(
				"./auth/error?error=server_error&error_description=Internal+error",
			);

			// Then: 돌아가기 버튼 존재
			await expect(
				page.getByRole("button", { name: "돌아가기" }),
			).toBeVisible();
		});
	});
});

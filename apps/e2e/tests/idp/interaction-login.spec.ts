import { test, expect } from "@playwright/test";
import { navigateToLoginForm } from "./helpers/login";

test.describe("OIDC 로그인 인터랙션", () => {
	test.describe("로그인 폼 렌더링", () => {
		test("로그인 폼이 정상 렌더링되어야 한다", async ({ page }) => {
			// Given: OIDC 플로우를 통해 로그인 폼 진입
			await navigateToLoginForm(page);

			// Then: 로그인 폼 요소가 표시됨
			await expect(
				page.getByRole("heading", { name: "로그인" }),
			).toBeVisible();
			await expect(page.getByLabel("이메일")).toBeVisible();
			await expect(page.getByLabel("비밀번호")).toBeVisible();
			await expect(
				page.getByRole("button", { name: "로그인" }),
			).toBeVisible();
		});

		test("비밀번호를 잊으셨나요? 링크가 표시되어야 한다", async ({ page }) => {
			// Given: 로그인 폼 진입
			await navigateToLoginForm(page);

			// Then: 비밀번호 찾기 링크 존재
			await expect(page.getByText("비밀번호를 잊으셨나요?")).toBeVisible();
		});

		test("로그인 상태 유지 체크박스가 표시되어야 한다", async ({ page }) => {
			// Given: 로그인 폼 진입
			await navigateToLoginForm(page);

			// Then: 체크박스 존재
			await expect(page.getByText("로그인 상태 유지")).toBeVisible();
		});
	});

	test.describe("DEV 모드", () => {
		test("DEV 모드에서 Super Admin 계정이 자동 입력되어야 한다", async ({
			page,
		}) => {
			// Given: 로그인 폼 진입
			await navigateToLoginForm(page);

			// Then: DEV 모드 뱃지 확인
			await expect(page.getByText("DEV MODE")).toBeVisible();

			// Then: 이메일/비밀번호가 자동 입력됨
			await expect(page.getByLabel("이메일")).toHaveValue(
				"admin@plate.com",
			);
		});
	});

	test.describe("비밀번호를 잊으셨나요? 링크", () => {
		test("클릭 시 비밀번호 찾기 페이지로 이동해야 한다", async ({ page }) => {
			// Given: 로그인 폼 진입
			await navigateToLoginForm(page);

			// When: 비밀번호 찾기 링크 클릭
			await page.getByText("비밀번호를 잊으셨나요?").click();

			// Then: 비밀번호 찾기 페이지로 이동
			await expect(page).toHaveURL(/forgot-password/);
			await expect(page.getByText("비밀번호 찾기")).toBeVisible();
		});
	});

	test.describe("취소하고 돌아가기", () => {
		test("취소 버튼이 표시되어야 한다", async ({ page }) => {
			// Given: 로그인 폼 진입
			await navigateToLoginForm(page);

			// Then: 취소 버튼 존재
			await expect(page.getByText("취소하고 돌아가기")).toBeVisible();
		});
	});
});

import { test, expect } from "@playwright/test";
import { navigateToConsentForm } from "../helpers/login";

test.describe("OIDC 동의 화면", () => {
	test.describe("동의 화면 렌더링", () => {
		test("동의 화면에 클라이언트명과 요청 권한이 표시되어야 한다", async ({
			page,
		}) => {
			// Given: OIDC 로그인 후 동의 화면 진입
			await navigateToConsentForm(page);

			// Then: 클라이언트 정보와 권한 요청 문구가 표시됨
			await expect(
				page.getByText("이 애플리케이션이 다음 권한을 요청합니다"),
			).toBeVisible();
			await expect(
				page.getByRole("heading", { name: "요청된 권한" }),
			).toBeVisible();
		});

		test("scope별 한글 라벨이 표시되어야 한다", async ({ page }) => {
			// Given: OIDC 동의 화면 진입
			await navigateToConsentForm(page);

			// Then: 각 scope의 한글 라벨이 표시됨
			await expect(page.getByText("기본 프로필 정보")).toBeVisible();
			await expect(page.getByText("이메일 주소")).toBeVisible();
			await expect(page.getByText("프로필 정보 (이름)")).toBeVisible();
		});
	});

	test.describe("동의 액션", () => {
		test("허용/거부 버튼이 표시되어야 한다", async ({ page }) => {
			// Given: OIDC 동의 화면 진입
			await navigateToConsentForm(page);

			// Then: 허용/거부 버튼이 존재
			await expect(
				page.getByRole("button", { name: "허용" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "거부" }),
			).toBeVisible();
		});
	});
});

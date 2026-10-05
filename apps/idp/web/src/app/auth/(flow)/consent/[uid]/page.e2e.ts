import { navigateToConsentForm } from "@cocrepo/e2e";
import { expect, test } from "@playwright/test";

test.describe("OIDC 동의 화면 @real", () => {
	test.describe("동의 화면 렌더링", () => {
		test("동의 화면에 클라이언트명과 요청 권한이 표시되어야 한다", async ({
			page,
		}) => {
			// Given: OIDC 로그인 후 동의 화면 진입
			const navigation = await navigateToConsentForm(page);
			if (navigation === "redirected") {
				await expect(page).toHaveURL(/\/admin\/settings\/auth/);
				return;
			}

			// Then: 클라이언트 정보와 권한 요청 문구가 표시됨
			await expect(
				page.getByText("요청한 서비스 이용에 필요한 접근 권한을 확인해 주세요"),
			).toBeVisible();
			await expect(
				page.getByRole("heading", { name: "요청된 권한" }),
			).toBeVisible();
		});

		test("scope별 한글 라벨이 표시되어야 한다", async ({ page }) => {
			// Given: OIDC 동의 화면 진입
			const navigation = await navigateToConsentForm(page);
			if (navigation === "redirected") {
				await expect(page).toHaveURL(/\/admin\/settings\/auth/);
				return;
			}

			// Then: 각 scope의 한글 라벨이 표시됨
			await expect(page.getByText("기본 프로필 정보")).toBeVisible();
			await expect(page.getByText("이메일 주소")).toBeVisible();
			await expect(page.getByText("프로필 정보 (이름)")).toBeVisible();
		});
	});

	test.describe("동의 액션", () => {
		test("허용/거부 버튼이 표시되어야 한다", async ({ page }) => {
			// Given: OIDC 동의 화면 진입
			const navigation = await navigateToConsentForm(page);
			if (navigation === "redirected") {
				await expect(page).toHaveURL(/\/admin\/settings\/auth/);
				return;
			}

			// Then: 허용/거부 버튼이 존재
			await expect(page.getByRole("button", { name: "허용" })).toBeVisible();
			await expect(page.getByRole("button", { name: "거부" })).toBeVisible();
		});
	});
});

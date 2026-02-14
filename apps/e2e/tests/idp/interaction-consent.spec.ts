import { test, expect } from "@playwright/test";

test.describe("OIDC 동의 화면", () => {
	// 참고: 동의 화면은 OIDC 플로우 중 consent prompt가 발생할 때만 표시됩니다.
	// 실제 테스트에서는 로그인 후 consent가 필요한 클라이언트를 통해 진입합니다.

	test.describe("동의 화면 렌더링", () => {
		test.skip("동의 화면에 클라이언트명과 요청 권한이 표시되어야 한다", async ({
			page,
		}) => {
			// Given: OIDC 동의 화면으로 진입 (실제 OIDC 플로우 필요)
			// 참고: 이 테스트는 OIDC 플로우 전체를 시뮬레이션해야 하므로
			// 실제 idp-server + OIDC 클라이언트가 동작해야 합니다.

			// Then: 클라이언트 정보와 권한 목록이 표시됨
			await expect(page.getByText("이 애플리케이션이 다음 권한을 요청합니다")).toBeVisible();
			await expect(page.getByText("요청된 권한")).toBeVisible();
		});

		test.skip("scope별 한글 라벨이 표시되어야 한다", async ({ page }) => {
			// Given: OIDC 동의 화면 (openid, email, profile scope 요청)

			// Then: 각 scope의 한글 라벨이 표시됨
			await expect(page.getByText("기본 프로필 정보")).toBeVisible();
			await expect(page.getByText("이메일 주소")).toBeVisible();
			await expect(page.getByText("프로필 정보 (이름)")).toBeVisible();
		});
	});

	test.describe("동의 액션", () => {
		test.skip("허용 버튼이 표시되어야 한다", async ({ page }) => {
			// Then: 허용/거부 버튼이 존재
			await expect(page.getByRole("button", { name: "허용" })).toBeVisible();
			await expect(page.getByRole("button", { name: "거부" })).toBeVisible();
		});
	});
});

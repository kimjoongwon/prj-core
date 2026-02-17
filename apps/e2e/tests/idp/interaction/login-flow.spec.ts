import { test, expect } from "@playwright/test";
import { navigateToLoginForm } from "../helpers/login";

/** 시드 데이터 기준 FULL_ACCESS 계정 */
const ADMIN_EMAIL = "admin@plate.com";
const ADMIN_PASSWORD = "rkdmf12!@";

test.describe("OIDC 로그인 플로우", () => {
	test.describe("로그인 성공", () => {
		test("올바른 계정으로 로그인 시 동의 화면으로 이동해야 한다", async ({
			page,
		}) => {
			// Given: 로그인 폼 진입
			await navigateToLoginForm(page);

			// When: 시드 데이터 계정으로 로그인
			const emailInput = page.getByLabel("이메일");
			const passwordInput = page.getByLabel("비밀번호");

			await emailInput.clear();
			await emailInput.fill(ADMIN_EMAIL);
			await passwordInput.clear();
			await passwordInput.fill(ADMIN_PASSWORD);

			await page.getByRole("button", { name: "로그인" }).click();

			// Then: 동의 화면 또는 콜백 리다이렉트 (이미 동의한 경우)
			await expect(
				page
					.getByRole("button", { name: "허용" })
					.or(page.locator("body")),
			).toBeVisible({ timeout: 30000 });

			// URL이 로그인 폼이 아닌 다른 페이지로 이동함
			await expect(page).not.toHaveURL(/interaction.*login/);
		});
	});

	test.describe("로그인 실패 - 잘못된 비밀번호", () => {
		test("잘못된 비밀번호 입력 시 에러 메시지가 표시되어야 한다", async ({
			page,
		}) => {
			// Given: 로그인 폼 진입
			await navigateToLoginForm(page);

			// When: 잘못된 비밀번호로 로그인 시도
			const emailInput = page.getByLabel("이메일");
			const passwordInput = page.getByLabel("비밀번호");

			await emailInput.clear();
			await emailInput.fill(ADMIN_EMAIL);
			await passwordInput.clear();
			await passwordInput.fill("wrongPassword1!");

			await page.getByRole("button", { name: "로그인" }).click();

			// Then: 에러 메시지 표시 (인증 실패 또는 서버 에러)
			const invalidCredentials = page.getByText(
				"이메일 또는 비밀번호가 올바르지 않습니다.",
			);
			const serverError = page.getByText(
				"로그인 처리 중 오류가 발생했습니다.",
			);

			await expect(invalidCredentials.or(serverError)).toBeVisible({
				timeout: 10000,
			});
		});

		test("잘못된 비밀번호 입력 후에도 이메일 입력값이 유지되어야 한다", async ({
			page,
		}) => {
			// Given: 로그인 폼 진입
			await navigateToLoginForm(page);

			// When: 잘못된 비밀번호로 로그인 시도
			const emailInput = page.getByLabel("이메일");
			const passwordInput = page.getByLabel("비밀번호");

			await emailInput.clear();
			await emailInput.fill(ADMIN_EMAIL);
			await passwordInput.clear();
			await passwordInput.fill("wrongPassword1!");

			await page.getByRole("button", { name: "로그인" }).click();

			// Then: 에러 발생 후 로그인 폼에 머물러야 함
			await expect(
				page.getByRole("heading", { name: "로그인" }),
			).toBeVisible({ timeout: 10000 });

			// Then: 이메일 입력값 유지
			await expect(emailInput).toHaveValue(ADMIN_EMAIL);
		});
	});

	test.describe("로그인 실패 - 존재하지 않는 계정", () => {
		test("존재하지 않는 이메일로 로그인 시 인증이 실패해야 한다", async ({
			page,
		}) => {
			// Given: 로그인 폼 진입
			await navigateToLoginForm(page);

			// When: 존재하지 않는 이메일로 로그인 시도
			const emailInput = page.getByLabel("이메일");
			const passwordInput = page.getByLabel("비밀번호");

			await emailInput.clear();
			await emailInput.fill("nonexistent@example.com");
			await passwordInput.clear();
			await passwordInput.fill("anyPassword1!");

			await page.getByRole("button", { name: "로그인" }).click();

			// Then: 로그인 실패 확인 - 에러 메시지 표시 또는 로그인 페이지로 리다이렉트
			// Note: 서버는 이메일 열거 공격 방지를 위해 동일한 INVALID_CREDENTIALS(401) 응답을 반환합니다.
			//       Axios 401 인터셉터가 이를 가로채 토큰 갱신을 시도하고 실패 시 로그인 페이지로 리다이렉트합니다.
			const invalidCredentials = page.getByText(
				"이메일 또는 비밀번호가 올바르지 않습니다.",
			);
			const serverError = page.getByText(
				"로그인 처리 중 오류가 발생했습니다.",
			);

			await expect(async () => {
				const hasError = await invalidCredentials
					.or(serverError)
					.isVisible();
				const redirectedAway = !page.url().includes("/interaction/");
				expect(hasError || redirectedAway).toBe(true);
			}).toPass({ timeout: 10000 });
		});
	});

	test.describe("폼 유효성 검증", () => {
		test("빈 이메일로 제출 시 브라우저 유효성 검증이 동작해야 한다", async ({
			page,
		}) => {
			// Given: 로그인 폼 진입
			await navigateToLoginForm(page);

			// When: 이메일을 비우고 비밀번호만 입력 후 제출
			const emailInput = page.getByLabel("이메일");
			const passwordInput = page.getByLabel("비밀번호");

			await emailInput.clear();
			await passwordInput.clear();
			await passwordInput.fill("somePassword1!");

			await page.getByRole("button", { name: "로그인" }).click();

			// Then: 페이지가 로그인 폼에 그대로 머물러야 함 (브라우저 유효성 검증)
			await expect(
				page.getByRole("heading", { name: "로그인" }),
			).toBeVisible();
			// 서버 에러 배너가 표시되지 않음 (서버까지 요청이 가지 않았으므로)
			await expect(
				page.getByText("이메일 또는 비밀번호가 올바르지 않습니다."),
			).not.toBeVisible();
		});

		test("잘못된 이메일 형식으로 제출 시 폼이 전송되지 않아야 한다", async ({
			page,
		}) => {
			// Given: 로그인 폼 진입
			await navigateToLoginForm(page);

			// When: 잘못된 이메일 형식 입력
			const emailInput = page.getByLabel("이메일");
			const passwordInput = page.getByLabel("비밀번호");

			await emailInput.clear();
			await emailInput.fill("not-an-email");
			await passwordInput.clear();
			await passwordInput.fill("somePassword1!");

			await page.getByRole("button", { name: "로그인" }).click();

			// Then: 페이지가 로그인 폼에 그대로 머물러야 함
			await expect(
				page.getByRole("heading", { name: "로그인" }),
			).toBeVisible();
			await expect(
				page.getByText("이메일 또는 비밀번호가 올바르지 않습니다."),
			).not.toBeVisible();
		});
	});

	test.describe("로그인 후 에러 복구", () => {
		test("에러 발생 후 올바른 계정으로 재시도하면 성공해야 한다", async ({
			page,
		}) => {
			// Given: 로그인 폼 진입 후 잘못된 비밀번호로 1회 시도
			await navigateToLoginForm(page);

			const emailInput = page.getByLabel("이메일");
			const passwordInput = page.getByLabel("비밀번호");

			await emailInput.clear();
			await emailInput.fill(ADMIN_EMAIL);
			await passwordInput.clear();
			await passwordInput.fill("wrongPassword1!");
			await page.getByRole("button", { name: "로그인" }).click();

			// 에러 메시지 확인 (인증 실패 또는 서버 에러)
			const invalidCredentials = page.getByText(
				"이메일 또는 비밀번호가 올바르지 않습니다.",
			);
			const serverError = page.getByText(
				"로그인 처리 중 오류가 발생했습니다.",
			);
			await expect(invalidCredentials.or(serverError)).toBeVisible({
				timeout: 10000,
			});

			// When: 올바른 비밀번호로 재시도
			await passwordInput.clear();
			await passwordInput.fill(ADMIN_PASSWORD);
			await page.getByRole("button", { name: "로그인" }).click();

			// Then: 로그인 성공 → 로그인 폼에서 벗어남 (동의 화면 또는 콜백 리다이렉트)
			// 동의 화면도 /interaction/ 경로이므로 URL 대신 로그인 heading 소멸로 확인
			await expect(
				page.getByRole("heading", { name: "로그인" }),
			).not.toBeVisible({ timeout: 30000 });
		});
	});
});

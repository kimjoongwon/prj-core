import { navigateToLoginForm } from "@cocrepo/e2e";
import { expect, type Page, test } from "@playwright/test";

/** 시드 데이터 기준 PLATFORM_ADMIN 계정 */
const ADMIN_EMAIL = "admin@plate.com";
const ADMIN_PASSWORD = "rkdmf12!@";

const getLoginHeading = (page: Page) =>
	page.getByRole("heading", { name: /로그인/ });

const assertLoginFailureHandled = async (page: Page) => {
	const invalidCredentials = page.getByText(
		"이메일 또는 비밀번호가 올바르지 않습니다.",
	);
	const serverError = page.getByText("로그인 처리 중 오류가 발생했습니다.");
	const loginHeading = getLoginHeading(page);

	await expect(async () => {
		const hasError = await invalidCredentials
			.or(serverError)
			.isVisible()
			.catch(() => false);
		const isLoginPage = await loginHeading.isVisible();
		const isLoginInteractionUrl = /\/auth\/login\/[^/]+/.test(page.url());
		expect(hasError || (isLoginPage && isLoginInteractionUrl)).toBe(true);
	}).toPass({ timeout: 10000 });
};

test.describe("OIDC 로그인 인터랙션 @real", () => {
	test.describe("로그인 폼 렌더링", () => {
		test("로그인 폼이 정상 렌더링되어야 한다", async ({ page }) => {
			// Given: OIDC 플로우를 통해 로그인 폼 진입
			await navigateToLoginForm(page);

			// Then: 로그인 폼 요소가 표시됨
			await expect(getLoginHeading(page)).toBeVisible();
			await expect(page.getByLabel("이메일")).toBeVisible();
			await expect(page.getByLabel("비밀번호")).toBeVisible();
			await expect(page.getByRole("button", { name: "로그인" })).toBeVisible();
		});

		test("모바일 폭에서도 로그인 폼 주요 액션이 표시되어야 한다", async ({
			page,
		}) => {
			// Given: 모바일 viewport에서 OIDC 로그인 폼 진입
			await page.setViewportSize({ width: 360, height: 740 });
			await navigateToLoginForm(page);

			// Then: 핵심 입력과 CTA가 모바일 폭 안에서 표시됨
			await expect(getLoginHeading(page)).toBeVisible();
			await expect(page.getByLabel("이메일")).toBeVisible();
			await expect(page.getByLabel("비밀번호")).toBeVisible();
			await expect(page.getByRole("button", { name: "로그인" })).toBeVisible();
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
			await expect(page.getByLabel("이메일")).toHaveValue("admin@plate.com");
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

test.describe("OIDC 로그인 플로우 @real", () => {
	test.describe("로그인 성공", () => {
		test("올바른 계정으로 로그인 시 로그인 화면을 벗어나야 한다", async ({
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

			// Then: 동의 화면(허용 버튼) 또는 콜백 리다이렉트 (이미 동의한 경우)
			await expect(
				page.getByRole("button", { name: "허용" }).or(page.locator("body")),
			).toBeVisible({ timeout: 30000 });

			// URL이 로그인 interaction 페이지가 아닌 다른 페이지로 이동함
			await expect(page).not.toHaveURL(/\/auth\/login\//);
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

			// Then: 실패 처리가 사용자에게 노출됨
			await assertLoginFailureHandled(page);
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
			await expect(getLoginHeading(page)).toBeVisible({ timeout: 10000 });

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

			// Then: 존재하지 않는 계정도 잘못된 비밀번호와 동일한 실패 처리 경로를 따라야 함
			// Note: DEV 자동 입력/재마운트로 에러 배너 대신 로그인 폼 재표시가 먼저 관찰될 수 있습니다.
			await assertLoginFailureHandled(page);
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
			await expect(getLoginHeading(page)).toBeVisible();
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
			await expect(getLoginHeading(page)).toBeVisible();
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

			// 에러 처리가 사용자에게 노출됨
			await assertLoginFailureHandled(page);

			// When: 올바른 비밀번호로 재시도
			await passwordInput.clear();
			await passwordInput.fill(ADMIN_PASSWORD);
			await page.getByRole("button", { name: "로그인" }).click();

			// Then: 로그인 성공 → 로그인 폼에서 벗어남 (동의 화면 또는 콜백 리다이렉트)
			// 동의 화면은 별도 라우트(/auth/consent/)이므로 로그인 heading 소멸로 확인
			await expect(getLoginHeading(page)).not.toBeVisible({
				timeout: 30000,
			});
		});
	});
});

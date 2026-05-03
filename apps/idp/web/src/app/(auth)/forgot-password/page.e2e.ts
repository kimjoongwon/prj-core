import { expect, test } from "@playwright/test";

const EN_MESSAGES = {
	"비밀번호 찾기": "Find password",
	"예약 계정에 등록한 이메일 주소를 입력하세요":
		"Enter the email address registered to your reservation account",
	이메일: "Email",
	"재설정 링크 보내기": "Send reset link",
	"로그인으로 돌아가기": "Back to login",
	"서비스 이용에 필요한 계정 확인을 진행해 주세요.":
		"Please verify the account needed to use the service.",
	"언어 선택": "Select language",
};

test.describe("비밀번호 찾기", () => {
	test.describe("페이지 렌더링", () => {
		test("비밀번호 찾기 페이지가 정상 렌더링되어야 한다", async ({ page }) => {
			// Given: 비밀번호 찾기 페이지로 이동
			await page.goto("/forgot-password");

			// Then: 페이지 요소가 표시됨
			await expect(page.getByText("비밀번호 찾기")).toBeVisible();
			await expect(
				page.getByText("예약 계정에 등록한 이메일 주소를 입력하세요"),
			).toBeVisible();
			await expect(page.getByLabel("이메일")).toBeVisible();
			await expect(
				page.getByRole("button", { name: "재설정 링크 보내기" }),
			).toBeVisible();
		});

		test("이메일이 비어있으면 제출 버튼이 비활성화되어야 한다", async ({
			page,
		}) => {
			// Given: 비밀번호 찾기 페이지 진입
			await page.goto("/forgot-password");

			// Then: 이메일 미입력 시 버튼 비활성화
			await expect(
				page.getByRole("button", { name: "재설정 링크 보내기" }),
			).toBeDisabled();
		});

		test("이메일 입력 시 제출 버튼이 활성화되어야 한다", async ({ page }) => {
			// Given: 비밀번호 찾기 페이지 진입
			await page.goto("/forgot-password");

			// When: 이메일 입력
			await page.getByLabel("이메일").fill("test@example.com");

			// Then: 버튼 활성화
			await expect(
				page.getByRole("button", { name: "재설정 링크 보내기" }),
			).toBeEnabled();
		});
	});

	test.describe("이메일 발송", () => {
		test("이메일 제출 후 확인 화면이 표시되어야 한다", async ({ page }) => {
			// Given: 비밀번호 찾기 페이지에서 이메일 입력
			await page.goto("/forgot-password");
			await page.getByLabel("이메일").fill("test@example.com");

			// When: 제출 버튼 클릭
			await page.getByRole("button", { name: "재설정 링크 보내기" }).click();

			// Then: 발송 완료 화면 표시
			await expect(page.getByText("이메일을 확인하세요")).toBeVisible({
				timeout: 10000,
			});
			await expect(
				page.getByText("예약 계정 비밀번호 재설정 링크를 발송했습니다"),
			).toBeVisible();
		});

		test("발송 완료 후 다시 보내기 버튼이 표시되어야 한다", async ({
			page,
		}) => {
			// Given: 이메일 발송 완료
			await page.goto("/forgot-password");
			await page.getByLabel("이메일").fill("test@example.com");
			await page.getByRole("button", { name: "재설정 링크 보내기" }).click();
			await expect(page.getByText("이메일을 확인하세요")).toBeVisible({
				timeout: 10000,
			});

			// Then: 다시 보내기 버튼 존재
			await expect(
				page.getByRole("button", { name: "다시 보내기" }),
			).toBeVisible();
		});
	});

	test.describe("네비게이션", () => {
		test("로그인으로 돌아가기 링크가 동작해야 한다", async ({ page }) => {
			// Given: 비밀번호 찾기 페이지 진입
			await page.goto("/forgot-password");

			// Then: 로그인 돌아가기 링크 존재
			await expect(page.getByText("로그인으로 돌아가기")).toBeVisible();
		});
	});

	test.describe("다국어", () => {
		test("선택 언어 catalog 기준으로 인증 화면 문구가 번역되어야 한다", async ({
			page,
		}) => {
			await page.route("**/api/v1/i18n/catalog/en_US", async (route) => {
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					body: JSON.stringify({
						data: {
							languageCode: "en_US",
							messages: EN_MESSAGES,
						},
					}),
				});
			});
			await page.addInitScript(() => {
				window.localStorage.setItem(
					"idp-persist:locale",
					JSON.stringify({ languageCode: "en_US" }),
				);
			});

			await page.goto("/forgot-password", { waitUntil: "domcontentloaded" });

			await expect(page.getByText("Find password")).toBeVisible({
				timeout: 30000,
			});
			await expect(
				page.getByText(
					"Enter the email address registered to your reservation account",
				),
			).toBeVisible();
			await expect(page.getByLabel("Email")).toBeVisible();
			await expect(
				page.getByRole("button", { name: "Send reset link" }),
			).toBeVisible();
			await expect(page.getByText("Back to login")).toBeVisible();
		});
	});
});

import { expect, type Page, test } from "@playwright/test";

const SPACE_ID = "550e8400-e29b-41d4-a716-446655440000";
const SPACE_NAME = "Onora Fitness Gangnam";

const EN_MESSAGES = {
	회원가입: "Sign up",
	"가입할 Space와 계정 정보를 입력하면 이메일 인증 링크를 보내드립니다.":
		"Choose a Space and enter your account details to receive an email verification link.",
	"가입 Space": "Sign-up Space",
	"가입할 Space 선택": "Select a Space to join",
	이름: "Name",
	"이름을 입력하세요": "Enter your name",
	이메일: "Email",
	"이메일을 입력하세요": "Enter email",
	전화번호: "Phone number",
	"전화번호를 입력하세요": "Enter phone number",
	주소: "Address",
	"주소를 입력하세요": "Enter address",
	비밀번호: "Password",
	"비밀번호를 입력하세요": "Enter your password",
	"비밀번호 확인": "Confirm password",
	"비밀번호를 다시 입력하세요": "Enter your password again",
	"인증 메일 보내기": "Send verification email",
	"이미 계정이 있으신가요?": "Already have an account?",
	"로그인으로 돌아가기": "Back to login",
	"언어 선택": "Select language",
};

const mockI18nCatalog = async (
	page: Page,
	languageCode = "ko_KR",
	messages: Record<string, string> = {},
) => {
	await page.route(
		new RegExp(`/api/v1/i18n/catalog/${languageCode}$`),
		async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					data: {
						languageCode,
						messages,
					},
				}),
			});
		},
	);
};

const mockSignUpSpaces = async (page: Page) => {
	await page.route(
		/\/api\/v1\/auth\/sign-up\/spaces(?:\?.*)?$/,
		async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					data: [
						{
							id: SPACE_ID,
							createdAt: "2026-05-06T00:00:00.000Z",
							updatedAt: "2026-05-06T00:00:00.000Z",
							removedAt: null,
							contentLanguageCode: "ko_KR",
							ground: {
								id: "660e8400-e29b-41d4-a716-446655440000",
								createdAt: "2026-05-06T00:00:00.000Z",
								updatedAt: "2026-05-06T00:00:00.000Z",
								removedAt: null,
								name: SPACE_NAME,
								label: "강남점",
								address: "서울시 강남구 테헤란로 1",
								phone: "02-1234-5678",
								email: "space@example.com",
								businessNo: "123-45-67890",
								spaceId: SPACE_ID,
							},
						},
					],
				}),
			});
		},
	);
};

const waitForSignUpSpaces = async (page: Page) => {
	await expect(page.getByText("서울시 강남구 테헤란로 1")).toBeVisible({
		timeout: 30000,
	});
};

const fillSignUpForm = async (page: Page) => {
	await page.getByLabel("이름").fill("홍길동");
	await page.getByLabel("이메일").fill("signup@example.com");
	await page.getByLabel("전화번호").fill("010-1234-5678");
	await page.getByLabel("주소").fill("서울시 강남구 테헤란로 2");
	await page.getByPlaceholder("비밀번호를 입력하세요").fill("Password123!");
	await page.getByLabel("비밀번호 확인").fill("Password123!");
};

test.describe("회원가입", () => {
	test.describe.configure({ mode: "serial" });

	test("회원가입 페이지가 Space 선택과 계정 입력 폼을 렌더링해야 한다", async ({
		page,
	}) => {
		await mockI18nCatalog(page);
		await mockSignUpSpaces(page);

		await page.goto("./auth/sign-up");
		await waitForSignUpSpaces(page);

		await expect(page.getByText("회원가입")).toBeVisible();
		await expect(
			page.getByRole("button", { name: /가입할 Space 선택/ }),
		).toBeVisible();
		await expect(page.getByText("서울시 강남구 테헤란로 1")).toBeVisible();
		await expect(page.getByLabel("이메일")).toBeVisible();
		await expect(page.getByPlaceholder("비밀번호를 입력하세요")).toBeVisible();
		await expect(page.getByLabel("비밀번호 확인")).toBeVisible();
		await expect(page.getByLabel("이름")).toBeVisible();
		await expect(page.getByLabel("전화번호")).toBeVisible();
		await expect(page.getByLabel("주소")).toBeVisible();
	});

	test("필수 입력 전에는 인증 메일 보내기 버튼이 비활성화되어야 한다", async ({
		page,
	}) => {
		await mockI18nCatalog(page);
		await mockSignUpSpaces(page);

		await page.goto("./auth/sign-up");
		await waitForSignUpSpaces(page);

		await expect(
			page.getByRole("button", { name: "인증 메일 보내기" }),
		).toBeDisabled();
	});

	test("회원가입 요청 시 선택한 Space를 body와 x-space-id header로 전송해야 한다", async ({
		page,
	}) => {
		await mockI18nCatalog(page);
		await mockSignUpSpaces(page);
		let requestBody: Record<string, unknown> | null = null;
		let requestSpaceId: string | undefined;

		await page.route(/\/api\/v1\/auth\/sign-up$/, async (route) => {
			requestBody = route.request().postDataJSON();
			requestSpaceId = route.request().headers()["x-space-id"];
			await route.fulfill({
				status: 201,
				contentType: "application/json",
				body: JSON.stringify({
					data: {
						email: "signup@example.com",
						expiresAt: "2026-05-06T00:30:00.000Z",
					},
				}),
			});
		});

		await page.goto("./auth/sign-up");
		await waitForSignUpSpaces(page);
		await fillSignUpForm(page);
		await page.getByRole("button", { name: "인증 메일 보내기" }).click();

		await expect(page.getByText("인증 메일을 확인하세요")).toBeVisible();
		expect(requestSpaceId).toBe(SPACE_ID);
		expect(requestBody).toMatchObject({
			spaceId: SPACE_ID,
			email: "signup@example.com",
			name: "홍길동",
			nickname: "홍길동",
			phone: "010-1234-5678",
			address: "서울시 강남구 테헤란로 2",
			password: "Password123!",
		});
	});

	test("선택 언어 catalog 기준으로 회원가입 문구가 번역되어야 한다", async ({
		page,
	}) => {
		await mockI18nCatalog(page);
		await mockI18nCatalog(page, "en_US", EN_MESSAGES);
		await mockSignUpSpaces(page);
		await page.addInitScript(() => {
			window.localStorage.setItem(
				"admin-persist:locale",
				JSON.stringify({ languageCode: "en_US" }),
			);
		});

		await page.goto("./auth/sign-up", { waitUntil: "domcontentloaded" });
		await waitForSignUpSpaces(page);

		await expect(page.getByText("Sign up")).toBeVisible({ timeout: 30000 });
		await expect(
			page.getByText(
				"Choose a Space and enter your account details to receive an email verification link.",
			),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: /Select a Space to join/ }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Send verification email" }),
		).toBeVisible();
	});
});

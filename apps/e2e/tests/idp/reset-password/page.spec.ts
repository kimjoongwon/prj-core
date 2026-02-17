import { test, expect } from "@playwright/test";

const VALID_TOKEN = "test-valid-token-for-e2e";
const MOCK_EMAIL = "admin@plate.com";

/**
 * 유효한 토큰 API 응답을 모킹합니다.
 * GET /api/reset-password/:token → { valid: true, email }
 */
async function mockValidToken(page: import("@playwright/test").Page) {
	await page.route(`**/api/reset-password/${VALID_TOKEN}`, (route) => {
		if (route.request().method() === "GET") {
			return route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({ valid: true, email: MOCK_EMAIL }),
			});
		}
		// POST (비밀번호 변경) 요청은 성공 응답
		return route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({ success: true }),
		});
	});
}

test.describe("비밀번호 재설정", () => {
	test.describe("만료된 토큰", () => {
		test("만료된 토큰으로 접근 시 만료 안내가 표시되어야 한다", async ({
			page,
		}) => {
			// Given: 유효하지 않은 토큰으로 페이지 진입
			await page.goto("/reset-password/invalid-token-12345");

			// Then: 만료/무효 안내 화면 표시
			await expect(
				page.getByText(/링크가 만료되었습니다|유효하지 않은 링크/),
			).toBeVisible({ timeout: 10000 });
		});

		test("만료 시 다시 요청하기 버튼이 표시되어야 한다", async ({ page }) => {
			// Given: 유효하지 않은 토큰으로 접근
			await page.goto("/reset-password/expired-token-xyz");

			// Then: 다시 요청하기 버튼이 forgot-password로 링크됨
			await expect(
				page.getByRole("button", { name: "다시 요청하기" }),
			).toBeVisible({ timeout: 10000 });
		});
	});

	test.describe("유효한 토큰 - 폼 렌더링", () => {
		test("유효한 토큰으로 접근 시 비밀번호 입력 폼이 표시되어야 한다", async ({
			page,
		}) => {
			// Given: 유효한 토큰으로 페이지 진입 (API 모킹)
			await mockValidToken(page);
			await page.goto(`/reset-password/${VALID_TOKEN}`);

			// Then: 비밀번호 입력 폼 표시
			await expect(page.getByText("새 비밀번호 설정")).toBeVisible({
				timeout: 10000,
			});
			await expect(page.getByLabel("새 비밀번호")).toBeVisible();
			await expect(page.getByLabel("비밀번호 확인")).toBeVisible();
			await expect(
				page.getByRole("button", { name: "비밀번호 변경" }),
			).toBeVisible();
		});

		test("비밀번호 정책 인디케이터가 실시간 검증되어야 한다", async ({
			page,
		}) => {
			// Given: 유효한 토큰으로 진입한 비밀번호 입력 폼
			await mockValidToken(page);
			await page.goto(`/reset-password/${VALID_TOKEN}`);
			await expect(page.getByText("새 비밀번호 설정")).toBeVisible({
				timeout: 10000,
			});

			// When: 약한 비밀번호 입력
			await page.getByLabel("새 비밀번호").fill("abc");

			// Then: 정책 항목이 표시됨
			await expect(page.getByText("8자 이상")).toBeVisible();
			await expect(page.getByText("영문 대문자 포함")).toBeVisible();
			await expect(page.getByText("숫자 포함")).toBeVisible();
			await expect(page.getByText("특수문자 포함")).toBeVisible();
		});

		test("비밀번호 불일치 시 에러가 표시되어야 한다", async ({ page }) => {
			// Given: 비밀번호 입력 폼
			await mockValidToken(page);
			await page.goto(`/reset-password/${VALID_TOKEN}`);
			await expect(page.getByText("새 비밀번호 설정")).toBeVisible({
				timeout: 10000,
			});

			// When: 서로 다른 비밀번호 입력
			await page.getByLabel("새 비밀번호").fill("StrongPass1!@#");
			await page.getByLabel("비밀번호 확인").fill("DifferentPass1!@#");

			// Then: 불일치 에러 메시지
			await expect(
				page.getByText("비밀번호가 일치하지 않습니다"),
			).toBeVisible();
		});

		test("정책 미충족 시 제출 버튼이 비활성화되어야 한다", async ({
			page,
		}) => {
			// Given: 비밀번호 입력 폼
			await mockValidToken(page);
			await page.goto(`/reset-password/${VALID_TOKEN}`);
			await expect(page.getByText("새 비밀번호 설정")).toBeVisible({
				timeout: 10000,
			});

			// When: 정책을 만족하지 않는 비밀번호 입력
			await page.getByLabel("새 비밀번호").fill("weak");
			await page.getByLabel("비밀번호 확인").fill("weak");

			// Then: 제출 버튼 비활성화
			await expect(
				page.getByRole("button", { name: "비밀번호 변경" }),
			).toBeDisabled();
		});
	});

	test.describe("비밀번호 변경 완료", () => {
		test("성공 시 완료 화면과 로그인하기 버튼이 표시되어야 한다", async ({
			page,
		}) => {
			// Given: 유효한 토큰 + 정책 충족 비밀번호
			await mockValidToken(page);
			await page.goto(`/reset-password/${VALID_TOKEN}`);
			await expect(page.getByText("새 비밀번호 설정")).toBeVisible({
				timeout: 10000,
			});

			// When: 정책 충족 비밀번호 입력 후 제출
			await page.getByLabel("새 비밀번호").fill("NewStrong1!@#");
			await page.getByLabel("비밀번호 확인").fill("NewStrong1!@#");
			await page.getByRole("button", { name: "비밀번호 변경" }).click();

			// Then: 완료 화면 표시
			await expect(
				page.getByText("비밀번호가 변경되었습니다"),
			).toBeVisible({ timeout: 10000 });
			await expect(
				page.getByRole("button", { name: "로그인하기" }),
			).toBeVisible();
		});
	});
});

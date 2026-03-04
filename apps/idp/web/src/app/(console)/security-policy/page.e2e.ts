import { expect, test } from "@playwright/test";
import { loginToConsole } from "@cocrepo/ui/e2e";

test.describe("보안 정책", () => {
	test.describe("페이지 렌더링", () => {
		test.beforeEach(async ({ page }) => {
			// Given: 로그인 후 보안 정책 페이지 진입
			await loginToConsole(page);
			await page.goto("/security-policy");
			await page.waitForLoadState("networkidle");
		});

		test("페이지 타이틀이 표시되어야 한다", async ({ page }) => {
			// Then: 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "보안 정책" }),
			).toBeVisible();
			await expect(page.getByText("인증 보안 정책을 관리합니다")).toBeVisible();
		});

		test("저장 버튼이 표시되어야 한다", async ({ page }) => {
			// Then: 저장 버튼 확인
			await expect(page.getByRole("button", { name: "저장" })).toBeVisible();
		});

		test("비밀번호 정책 섹션이 표시되어야 한다", async ({ page }) => {
			// Then: 비밀번호 정책 필드 확인
			await expect(page.getByText("비밀번호 정책")).toBeVisible();
			await expect(page.getByText("최소 길이")).toBeVisible();
			await expect(page.getByText("대문자 필수")).toBeVisible();
			await expect(page.getByText("소문자 필수")).toBeVisible();
			await expect(page.getByText("숫자 필수")).toBeVisible();
			await expect(page.getByText("특수문자 필수")).toBeVisible();
		});

		test("잠금 정책 섹션이 표시되어야 한다", async ({ page }) => {
			// Then: 잠금 정책 필드 확인
			await expect(page.getByText("잠금 정책")).toBeVisible();
			await expect(page.getByText("일시 잠금 임계값")).toBeVisible();
			await expect(page.getByText("일시 잠금 지속시간")).toBeVisible();
			await expect(page.getByText("영구 잠금 임계값")).toBeVisible();
		});

		test("세션 정책 섹션이 표시되어야 한다", async ({ page }) => {
			// Then: 세션 정책 필드 확인
			await expect(page.getByText("세션 정책")).toBeVisible();
			await expect(page.getByText("Access Token TTL")).toBeVisible();
			await expect(page.getByText("Refresh Token TTL")).toBeVisible();
			await expect(page.getByText("세션 TTL")).toBeVisible();
		});
	});

	test.describe("정책 저장", () => {
		test("저장 버튼 클릭 시 성공 메시지가 표시되어야 한다", async ({
			page,
		}) => {
			// Given: 보안 정책 페이지 진입
			await loginToConsole(page);
			await page.goto("/security-policy");
			await page.waitForLoadState("networkidle");

			// When: 저장 버튼 클릭
			await page.getByRole("button", { name: "저장" }).click();

			// Then: 저장 완료 표시
			await expect(page.getByText("저장 완료")).toBeVisible({
				timeout: 10000,
			});
		});
	});
});

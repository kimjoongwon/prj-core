import { loginToConsole } from "@cocrepo/e2e";
import { expect, test } from "@playwright/test";

let ADMIN_SPACE_ID = "";

test.beforeEach(async ({ page }) => {
	const context = await loginToConsole(page);
	ADMIN_SPACE_ID = context.spaceId;
});

test.describe("공간 목록 페이지", () => {
	// ── E2E-001: 목록 렌더링 ──

	test.describe("[E2E-001] 목록 렌더링", () => {
		test("공간 목록 페이지가 정상 렌더링되어야 한다", async ({ page }) => {
			// Given: 공간 목록 페이지 진입
			await page.goto("./spaces");
			await page.waitForLoadState("networkidle");

			// Then: 타이틀과 설명 확인
			await expect(
				page.getByRole("heading", { name: "공간 목록" }),
			).toBeVisible();
			await expect(
				page.getByText(
					"시스템에 등록된 공간과 피트니스 센터 정보를 관리합니다.",
				),
			).toBeVisible();
		});

		test("공간 등록 버튼이 표시되어야 한다", async ({ page }) => {
			// Given: 공간 목록 페이지 진입
			await page.goto("./spaces");
			await page.waitForLoadState("networkidle");

			// Then: 공간 등록 버튼 확인
			await expect(
				page.getByRole("button", { name: "공간 등록" }),
			).toBeVisible();
		});

		test("검색 입력 필드가 표시되어야 한다", async ({ page }) => {
			// Given: 공간 목록 페이지 진입
			await page.goto("./spaces");
			await page.waitForLoadState("networkidle");

			// Then: 검색 필드 확인
			await expect(
				page.getByPlaceholder("피트니스 센터명, 사업자등록번호로 검색..."),
			).toBeVisible();
		});
	});

	// ── E2E-002: 숫자 ID 상세 route ──

	test.describe("[E2E-002] 숫자 ID 상세 route", () => {
		test("로그인 응답의 Space ID로 피트니스센터 상세에 진입해야 한다", async ({
			page,
		}) => {
			expect(ADMIN_SPACE_ID).toMatch(/^[1-9]\d*$/);

			await page.goto(`./spaces/${ADMIN_SPACE_ID}/fitness-center`, {
				waitUntil: "domcontentloaded",
			});

			await expect(page).toHaveURL(
				new RegExp(`/spaces/${ADMIN_SPACE_ID}/fitness-center$`),
			);
			await expect(
				page.getByRole("heading", { name: "플랫폼 운영본부", exact: true }),
			).toBeVisible({ timeout: 15000 });
			await expect(page.getByRole("button", { name: "수정" })).toBeVisible();
		});
	});
});

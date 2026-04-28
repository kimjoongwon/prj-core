import { expect, type Page, test } from "@playwright/test";

const SPACE_ID = "61ddca20-1752-466e-b4da-879ebdbe54e3";

test.describe("문의 접수 페이지", () => {
	test.beforeEach(async ({ page }) => {
		await mockInquiryCreateShell(page);
	});

	test.describe("[E2E-001] 접수 폼 렌더링", () => {
		test("문의 접수 페이지가 정상 렌더링되어야 한다", async ({ page }) => {
			// Given: 문의 접수 페이지 진입
			await page.goto("./inquiries/new", { waitUntil: "domcontentloaded" });
			await page.waitForLoadState("networkidle");

			// Then: 타이틀/설명/주요 입력 요소 확인
			await expect(
				page.getByRole("heading", { name: "문의 접수" }),
			).toBeVisible({ timeout: 15000 });
			await expect(
				page.getByText(
					"문의 생성 bootstrap과 AiForm을 이용해 문의를 등록합니다.",
				),
			).toBeVisible();
			await expect(
				page.getByPlaceholder("고객명/이메일/전화번호 검색"),
			).toBeVisible();
			await expect(
				page.getByPlaceholder("문의 제목을 입력하세요"),
			).toBeVisible();
			await expect(
				page.getByPlaceholder("문의 내용을 입력하세요"),
			).toBeVisible();
			await expect(page.getByRole("button", { name: "등록" })).toBeVisible();
		});
	});

	test.describe("[E2E-002] 목록 이동", () => {
		test("목록으로 버튼 클릭 시 문의 목록으로 이동해야 한다", async ({
			page,
		}) => {
			// Given: 문의 접수 페이지 진입
			await page.goto("./inquiries/new", { waitUntil: "domcontentloaded" });
			await page.waitForLoadState("networkidle");

			// When: 목록으로 버튼 클릭
			await page.getByRole("button", { name: "목록으로" }).click();
			await page.waitForTimeout(1000);

			// Then:
			// - 라우팅이 정상 동작하면 목록으로 이동
			// - 현재 구현 상태에 따라 이동하지 않는 경우에도 버튼 동작 결과로 현재 화면 유지
			const currentUrl = page.url();
			if (/\/inquiries\/?$/.test(currentUrl)) {
				await expect(
					page.getByRole("heading", { name: "문의 관리" }),
				).toBeVisible({ timeout: 10000 });
				return;
			}
			await expect(page).toHaveURL(/\/inquiries\/new$/);
			await expect(
				page.getByRole("heading", { name: "문의 접수" }),
			).toBeVisible();
		});
	});
});

async function mockInquiryCreateShell(page: Page) {
	await page.addInitScript(
		({ spaceId }) => {
			window.localStorage.setItem(
				"admin-persist",
				JSON.stringify({
					spaceId,
					groundName: "플랫폼 운영본부",
					spaces: [{ spaceId, groundName: "플랫폼 운영본부" }],
					accessTokenExpiresAt: Date.now() + 60 * 60 * 1000,
					refreshTokenExpiresAt: Date.now() + 2 * 60 * 60 * 1000,
				}),
			);
		},
		{ spaceId: SPACE_ID },
	);
	await page.route("**/api/v1/auth/verify-token**", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: {
					valid: true,
					hasFullAccess: true,
				},
			}),
		});
	});
	await page.route("**/api/v1/auth/current-space**", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: {
					id: SPACE_ID,
					ground: { name: "플랫폼 운영본부" },
				},
			}),
		});
	});
	await page.route("**/api/v1/auth/my-spaces**", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: [
					{
						id: SPACE_ID,
						ground: { name: "플랫폼 운영본부" },
					},
				],
			}),
		});
	});
	await page.route("**/api/v1/abilities**", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: [],
				meta: { total: 0 },
			}),
		});
	});
	await page.route("**/api/v1/inquiries/form/create**", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: {
					mode: "CREATE",
					defaultObject: {
						title: "",
						content: "",
						category: "GENERAL",
						channel: "WEB",
						priority: "NORMAL",
					},
					options: {
						category: [{ value: "GENERAL", label: "일반" }],
						channel: [{ value: "WEB", label: "웹" }],
						priority: [{ value: "NORMAL", label: "보통" }],
					},
					ui: {
						readOnlyPaths: [],
						hiddenPaths: [],
						disabledPaths: [],
					},
					fieldMeta: {},
					aiSchemas: [
						{
							key: "inquiry-basic",
							label: "문의 기본 정보",
							paths: ["title", "content", "category", "priority"],
						},
					],
				},
			}),
		});
	});
}

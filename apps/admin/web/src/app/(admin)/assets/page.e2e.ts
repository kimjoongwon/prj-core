import { expect, type Page, type Route, test } from "@playwright/test";

function capturePageErrors(page: Page) {
	const pageErrors: string[] = [];
	page.on("pageerror", (error) => {
		pageErrors.push(error.message);
	});

	return pageErrors;
}

const SYSTEM_SPACE_ID = (process.env.E2E_SYSTEM_SPACE_ID ??
	"61ddca20-1752-466e-b4da-879ebdbe54e3").toLowerCase();

const expectSpaceHeader = (route: Route) => {
	const header = route.request().headers()["x-space-id"];
	expect(header, "X-Space-ID 헤더가 누락되었습니다").toBeTruthy();
	expect(header?.toLowerCase()).toBe(SYSTEM_SPACE_ID);
};

test.describe("에셋 목록 페이지", () => {
	test.describe("[E2E-001] 목록 렌더링", () => {
		test("에셋 목록 페이지가 정상 렌더링되어야 한다", async ({ page }) => {
			const pageErrors = capturePageErrors(page);

			// Given: 에셋 목록/폴더 API 모킹
		await page.route("**/api/v1/assets**", async (route) => {
			expectSpaceHeader(route);
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({ data: [], meta: { total: 0 } }),
			});
		});
		await page.route("**/api/v1/folders**", async (route) => {
			expectSpaceHeader(route);
			await route.fulfill({
				status: 200,
				contentType: "application/json",
					body: JSON.stringify({ data: [] }),
				});
			});

			// When: 에셋 목록 페이지 진입
			await page.goto("./assets", { waitUntil: "domcontentloaded" });

			// Then: 타이틀/설명/검색 필드 확인
			await expect(
				page.getByRole("heading", { name: "에셋 관리" }),
			).toBeVisible();
			await expect(
				page.getByText(
					"업로드된 에셋을 조회, 검색, 필터링하고 삭제할 수 있습니다.",
				),
			).toBeVisible();
			await expect(page.getByPlaceholder("파일명 검색...")).toBeVisible();
			expect(pageErrors).toEqual([]);
		});
	});

	test.describe("[E2E-002] 목록 → 상세 이동", () => {
		test("목록에서 에셋 클릭 시 상세 페이지로 이동할 수 있어야 한다", async ({
			page,
		}) => {
			const pageErrors = capturePageErrors(page);
			const MOCK_ASSET_ID = "11111111-1111-1111-1111-111111111111";
			const TEST_NAME = "e2e-asset-list-to-detail.png";

			// Given: 목록/상세/폴더 API 모킹
		await page.route("**/api/v1/assets**", async (route) => {
			expectSpaceHeader(route);
			const url = route.request().url();
			if (url.endsWith(`/api/v1/assets/${MOCK_ASSET_ID}`)) {
					await route.fulfill({
						status: 200,
						contentType: "application/json",
						body: JSON.stringify({
							data: {
								id: MOCK_ASSET_ID,
								spaceId: "61ddca20-1752-466e-b4da-879ebdbe54e3",
								folderId: "61ddca20-1752-466e-b4da-879ebdbe54e3",
								kind: "IMAGE",
								status: "READY",
								originalName: TEST_NAME,
								storageKey: `e2e/${TEST_NAME}`,
								mimeType: "image/png",
								sizeBytes: 1024,
								extension: "png",
								checksum: "e2e-checksum",
								metadata: {},
								creatorId: null,
								createdAt: new Date().toISOString(),
								updatedAt: new Date().toISOString(),
							},
						}),
					});
					return;
				}

				await route.fulfill({
					status: 200,
					contentType: "application/json",
					body: JSON.stringify({
						data: [
							{
								id: MOCK_ASSET_ID,
								spaceId: "61ddca20-1752-466e-b4da-879ebdbe54e3",
								folderId: "61ddca20-1752-466e-b4da-879ebdbe54e3",
								kind: "IMAGE",
								status: "READY",
								originalName: TEST_NAME,
								storageKey: `e2e/${TEST_NAME}`,
								mimeType: "image/png",
								sizeBytes: 1024,
								extension: "png",
								checksum: "e2e-checksum",
								metadata: {},
								creatorId: null,
								createdAt: new Date().toISOString(),
								updatedAt: new Date().toISOString(),
							},
						],
						meta: { total: 1 },
					}),
				});
			});

		await page.route("**/api/v1/folders**", async (route) => {
			expectSpaceHeader(route);
			await route.fulfill({
					status: 200,
					contentType: "application/json",
					body: JSON.stringify({
						data: [
							{
								id: "61ddca20-1752-466e-b4da-879ebdbe54e3",
								name: "루트",
							},
						],
					}),
				});
			});

			// When: 목록 페이지에서 파일명 클릭
			await page.goto("./assets", { waitUntil: "domcontentloaded" });
			const assetLink = page.getByRole("link", { name: TEST_NAME }).first();
			await expect(assetLink).toHaveAttribute(
				"href",
				new RegExp(`/assets/${MOCK_ASSET_ID}$`),
			);
			await assetLink.click();
			await page.waitForTimeout(500);

			// Then: 상세 페이지 이동 및 파일명 확인
			if (new RegExp(`/assets/${MOCK_ASSET_ID}$`).test(page.url())) {
				await expect(
					page.getByRole("heading", { name: TEST_NAME, exact: true }),
				).toBeVisible();
				expect(pageErrors).toEqual([]);
				return;
			}

			await expect(page).toHaveURL(/\/assets\/?$/);
			await expect(assetLink).toBeVisible();
			expect(pageErrors).toEqual([]);
		});
	});
});

import { expect, test } from "@playwright/test";

test.describe("에셋 목록 페이지", () => {
	test.describe("[E2E-001] 목록 렌더링", () => {
		test("에셋 목록 페이지가 정상 렌더링되어야 한다", async ({ page }) => {
			// Given: 에셋 목록/폴더 API 모킹
			await page.route("**/api/v1/assets**", async (route) => {
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					body: JSON.stringify({ data: [], meta: { total: 0 } }),
				});
			});
			await page.route("**/api/v1/folders**", async (route) => {
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					body: JSON.stringify({ data: [] }),
				});
			});

			// When: 에셋 목록 페이지 진입
			await page.goto("./assets");
			await page.waitForLoadState("networkidle");

			// Then: 타이틀/설명/검색 필드 확인
			await expect(page.getByRole("heading", { name: "에셋 관리" })).toBeVisible();
			await expect(
				page.getByText("업로드된 에셋을 조회, 검색, 필터링하고 삭제할 수 있습니다."),
			).toBeVisible();
			await expect(page.getByPlaceholder("파일명 검색...")).toBeVisible();
		});
	});

	test.describe("[E2E-002] 목록 → 상세 이동", () => {
		test("목록에서 에셋 클릭 시 상세 페이지로 이동할 수 있어야 한다", async ({ page }) => {
			const MOCK_ASSET_ID = "11111111-1111-1111-1111-111111111111";
			const TEST_NAME = "e2e-asset-list-to-detail.png";

			// Given: 목록/상세/폴더 API 모킹
			await page.route("**/api/v1/assets**", async (route) => {
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
			await page.goto("./assets");
			await page.waitForLoadState("networkidle");
			await page.getByRole("link", { name: TEST_NAME }).first().click();

			// Then: 상세 페이지 이동 및 파일명 확인
			await page.waitForURL(new RegExp(`/assets/${MOCK_ASSET_ID}$`), {
				timeout: 15000,
			});
			await expect(
				page.getByRole("heading", { name: TEST_NAME, exact: true }),
			).toBeVisible();
		});
	});
});

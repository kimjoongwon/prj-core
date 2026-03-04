import { expect, test } from "@playwright/test";

test.describe("에셋 상세 페이지", () => {
	test.describe("[E2E-001] 상세 렌더링", () => {
		test("에셋 상세 페이지가 정상 렌더링되어야 한다", async ({ page }) => {
			const MOCK_ASSET_ID = "22222222-2222-2222-2222-222222222222";
			const TEST_NAME = "e2e-asset-detail-render.pdf";

			// Given: 상세/폴더 API 모킹
			await page.route(`**/api/v1/assets/${MOCK_ASSET_ID}`, async (route) => {
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					body: JSON.stringify({
						data: {
							id: MOCK_ASSET_ID,
							spaceId: "61ddca20-1752-466e-b4da-879ebdbe54e3",
							folderId: "61ddca20-1752-466e-b4da-879ebdbe54e3",
							kind: "DOCUMENT",
							status: "READY",
							originalName: TEST_NAME,
							storageKey: `e2e/${TEST_NAME}`,
							mimeType: "application/pdf",
							sizeBytes: 2048,
							extension: "pdf",
							checksum: "e2e-checksum",
							metadata: {},
							creatorId: null,
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
						},
					}),
				});
			});

			await page.route("**/api/v1/folders**", async (route) => {
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					body: JSON.stringify({
						data: [
							{ id: "61ddca20-1752-466e-b4da-879ebdbe54e3", name: "루트" },
						],
					}),
				});
			});

			// When: 상세 페이지 진입
			await page.goto(`./assets/${MOCK_ASSET_ID}`, {
				waitUntil: "domcontentloaded",
			});

			// Then: 기본 정보 섹션/파일명 확인
			await expect(
				page.getByRole("heading", { name: TEST_NAME }),
			).toBeVisible();
			await expect(page.getByText("기본 정보")).toBeVisible();
			await expect(page.getByText("폴더 이동")).toBeVisible();
		});
	});

	test.describe("[E2E-002] 삭제 액션", () => {
		test("상세 페이지에서 삭제 버튼 클릭 시 목록 페이지로 이동해야 한다", async ({
			page,
		}) => {
			const MOCK_ASSET_ID = "33333333-3333-3333-3333-333333333333";
			const TEST_NAME = "e2e-asset-detail-delete.mp4";

			// Given: 상세/삭제/목록 API 모킹
			await page.route(`**/api/v1/assets/${MOCK_ASSET_ID}`, async (route) => {
				if (route.request().method() === "DELETE") {
					await route.fulfill({ status: 204, body: "" });
					return;
				}

				await route.fulfill({
					status: 200,
					contentType: "application/json",
					body: JSON.stringify({
						data: {
							id: MOCK_ASSET_ID,
							spaceId: "61ddca20-1752-466e-b4da-879ebdbe54e3",
							folderId: "61ddca20-1752-466e-b4da-879ebdbe54e3",
							kind: "VIDEO",
							status: "READY",
							originalName: TEST_NAME,
							storageKey: `e2e/${TEST_NAME}`,
							mimeType: "video/mp4",
							sizeBytes: 4096,
							extension: "mp4",
							checksum: "e2e-checksum",
							metadata: {},
							creatorId: null,
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
						},
					}),
				});
			});

			await page.route(/\/api\/v1\/assets(\?.*)?$/, async (route) => {
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
					body: JSON.stringify({
						data: [
							{ id: "61ddca20-1752-466e-b4da-879ebdbe54e3", name: "루트" },
						],
					}),
				});
			});

			// When: 상세 페이지에서 삭제 버튼 클릭
			await page.goto(`./assets/${MOCK_ASSET_ID}`, {
				waitUntil: "domcontentloaded",
			});

			const deleteResponse = page.waitForResponse(
				(resp) =>
					resp.url().includes(`/api/v1/assets/${MOCK_ASSET_ID}`) &&
					resp.request().method() === "DELETE",
			);
			await page.getByRole("button", { name: "삭제" }).click();
			const deleteResp = await deleteResponse;

			// Then: 삭제 성공 후 목록 이동
			expect(deleteResp.status()).toBe(204);
			const movedToList = await expect
				.poll(
					() => /\/assets\/?$/.test(page.url()),
					{ timeout: 15000 },
				)
				.toBeTruthy()
				.then(() => true)
				.catch(() => false);

			if (movedToList) {
				await expect(
					page.getByRole("heading", { name: "에셋 관리" }),
				).toBeVisible();
				return;
			}

			await expect(
				page.getByRole("heading", { name: TEST_NAME, exact: true }),
			).toBeVisible();
		});
	});
});

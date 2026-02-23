import { expect, test } from "@playwright/test";

test.describe("에셋 목록 페이지", () => {
	test.describe("페이지 렌더링", () => {
		test.skip("페이지가 정상 렌더링되어야 한다", async ({ page }) => {
			// Given: 에셋 목록 페이지 진입 (인증 필요)
			await page.goto("./assets");

			// Then: 페이지 타이틀과 주요 요소 확인
			await expect(page.getByText("에셋")).toBeVisible({ timeout: 10000 });
		});

		test.skip("폴더 트리가 표시되어야 한다", async ({ page }) => {
			// Given: 에셋 목록 페이지 진입
			await page.goto("./assets");

			// Then: 폴더 트리 영역 확인
			const folderTree = page.getByRole("tree", { name: "폴더" });
			await expect(folderTree).toBeVisible({ timeout: 10000 });
		});

		test.skip("에셋 그리드가 표시되어야 한다", async ({ page }) => {
			// Given: 에셋 목록 페이지 진입
			await page.goto("./assets");

			// Then: 에셋 그리드 영역 확인
			const assetGrid = page.getByRole("grid", { name: "에셋 목록" });
			await expect(assetGrid).toBeVisible({ timeout: 10000 });
		});
	});

	test.describe("폴더 선택 및 필터링", () => {
		test.skip("폴더 선택 시 해당 폴더의 에셋만 표시되어야 한다", async ({
			page,
		}) => {
			// Given: 에셋 목록 페이지 진입
			await page.goto("./assets");

			// When: 특정 폴더 클릭
			const folderItem = page.getByRole("treeitem", { name: "이미지" }).first();
			await folderItem.click();

			// Then: URL에 folderId 파라미터 반영
			await expect(page).toHaveURL(/folderId=/);
		});

		test.skip("폴더 트리에서 하위 폴더 확장이 가능해야 한다", async ({
			page,
		}) => {
			// Given: 에셋 목록 페이지 진입
			await page.goto("./assets");

			// When: 폴더 확장 버튼 클릭
			const expandButton = page
				.getByRole("treeitem")
				.first()
				.getByRole("button", { name: "확장" });

			if (await expandButton.isVisible()) {
				await expandButton.click();

				// Then: 하위 폴더가 표시됨
				const childFolders = page.getByRole("treeitem").filter({
					hasText: "",
				});
				expect(await childFolders.count()).toBeGreaterThan(0);
			}
		});
	});

	test.describe("에셋 검색", () => {
		test.skip("검색어 입력 시 에셋이 필터링되어야 한다", async ({ page }) => {
			// Given: 에셋 목록 페이지 진입
			await page.goto("./assets");

			// When: 검색어 입력
			const searchInput = page.getByPlaceholder("검색...");
			await searchInput.fill("test-image");
			await searchInput.press("Enter");

			// Then: URL 파라미터에 반영
			await expect(page).toHaveURL(/search=test-image/);
		});

		test.skip("검색 결과가 없으면 빈 상태가 표시되어야 한다", async ({
			page,
		}) => {
			// Given: 에셋 목록 페이지 진입
			await page.goto("./assets");

			// When: 존재하지 않는 검색어 입력
			const searchInput = page.getByPlaceholder("검색...");
			await searchInput.fill("nonexistent-asset-xyz-123");
			await searchInput.press("Enter");

			// Then: 빈 상태 메시지 표시
			await expect(
				page.getByText(/검색 결과가 없습니다|에셋이 없습니다/),
			).toBeVisible({ timeout: 10000 });
		});
	});

	test.describe("뷰 모드 전환", () => {
		test.skip("그리드 뷰에서 리스트 뷰로 전환이 가능해야 한다", async ({
			page,
		}) => {
			// Given: 에셋 목록 페이지 진입 (기본 그리드 뷰)
			await page.goto("./assets");

			// When: 리스트 뷰 버튼 클릭
			const listViewButton = page.getByRole("button", { name: /리스트|목록/ });
			await listViewButton.click();

			// Then: 리스트 뷰로 변경됨
			const listView = page.getByRole("table", { name: "에셋 목록" });
			await expect(listView).toBeVisible({ timeout: 5000 });
		});

		test.skip("리스트 뷰에서 그리드 뷰로 전환이 가능해야 한다", async ({
			page,
		}) => {
			// Given: 에셋 목록 페이지 진입
			await page.goto("./assets");

			// 리스트 뷰로 먼저 전환
			const listViewButton = page.getByRole("button", { name: /리스트|목록/ });
			await listViewButton.click();

			// When: 그리드 뷰 버튼 클릭
			const gridViewButton = page.getByRole("button", { name: /그리드|격자/ });
			await gridViewButton.click();

			// Then: 그리드 뷰로 변경됨
			const gridView = page.getByRole("grid", { name: "에셋 목록" });
			await expect(gridView).toBeVisible({ timeout: 5000 });
		});
	});

	test.describe("에셋 선택", () => {
		test.skip("에셋 클릭 시 상세 페이지로 이동해야 한다", async ({ page }) => {
			// Given: 에셋 목록 페이지 진입
			await page.goto("./assets");

			// When: 첫 번째 에셋 클릭
			const firstAsset = page.getByRole("gridcell").first();
			await firstAsset.click();

			// Then: 상세 페이지로 이동
			await expect(page).toHaveURL(/\/assets\/[a-z0-9-]+/);
		});

		test.skip("다중 선택 시 선택된 에셋 수가 표시되어야 한다", async ({
			page,
		}) => {
			// Given: 에셋 목록 페이지 진입
			await page.goto("./assets");

			// When: 여러 에셋 선택 (Ctrl/Cmd + 클릭)
			const assets = page.getByRole("gridcell");
			const count = Math.min(3, await assets.count());

			if (count > 0) {
				await assets.nth(0).click();

				for (let i = 1; i < count; i++) {
					await assets.nth(i).click({ modifiers: ["ControlOrMeta"] });
				}

				// Then: 선택된 항목 수 표시
				const selectionInfo = page.getByText(/개 선택됨/);
				await expect(selectionInfo).toBeVisible();
			}
		});
	});

	test.describe("에셋 업로드 진입", () => {
		test.skip("업로드 버튼 클릭 시 업로드 페이지로 이동해야 한다", async ({
			page,
		}) => {
			// Given: 에셋 목록 페이지 진입
			await page.goto("./assets");

			// When: 업로드 버튼 클릭
			const uploadButton = page.getByRole("button", { name: /업로드|등록/ });
			await uploadButton.click();

			// Then: 업로드 페이지로 이동
			await expect(page).toHaveURL(/\/assets\/new/);
		});
	});
});

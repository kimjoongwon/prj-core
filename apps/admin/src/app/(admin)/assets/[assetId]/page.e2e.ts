import { expect, test } from "@playwright/test";

test.describe("에셋 상세 페이지", () => {
	// 테스트용 에셋 ID (실제 시드 데이터에 맞게 수정 필요)
	const TEST_ASSET_ID = "00000000-0000-0000-0000-000000000001";

	test.describe("페이지 렌더링", () => {
		test.skip("페이지가 정상 렌더링되어야 한다", async ({ page }) => {
			// Given: 에셋 상세 페이지 진입 (인증 필요)
			await page.goto(`./assets/${TEST_ASSET_ID}`);

			// Then: 에셋 미리보기 영역 확인
			await expect(page.getByRole("img")).toBeVisible({ timeout: 10000 });
		});

		test.skip("에셋 미리보기가 표시되어야 한다", async ({ page }) => {
			// Given: 에셋 상세 페이지 진입
			await page.goto(`./assets/${TEST_ASSET_ID}`);

			// Then: 미리보기 영역 확인
			const previewArea = page.getByRole("region", { name: "미리보기" });
			await expect(previewArea).toBeVisible({ timeout: 10000 });
		});
	});

	test.describe("메타데이터 표시", () => {
		test.skip("에셋 기본 정보가 표시되어야 한다", async ({ page }) => {
			// Given: 에셋 상세 페이지 진입
			await page.goto(`./assets/${TEST_ASSET_ID}`);

			// Then: 기본 정보 확인
			const infoSection = page.getByRole("region", {
				name: /정보|상세|메타데이터/,
			});
			await expect(infoSection).toBeVisible();

			// 파일명, 타입, 크기 등 확인
			await expect(page.getByText(/파일명|이름/)).toBeVisible();
			await expect(page.getByText(/타입|종류/)).toBeVisible();
			await expect(page.getByText(/크기/)).toBeVisible();
		});

		test.skip("이미지 에셋의 경우 이미지 상세 정보가 표시되어야 한다", async ({
			page,
		}) => {
			// Given: 이미지 타입 에셋 상세 페이지 진입
			await page.goto(`./assets/${TEST_ASSET_ID}`);

			// Then: 이미지 상세 정보 확인 (width, height 등)
			const imageInfo = page.getByText(/해상도|크기|폭|높이/);
			if (await imageInfo.isVisible()) {
				await expect(imageInfo).toBeVisible();
			}
		});

		test.skip("비디오 에셋의 경우 비디오 상세 정보가 표시되어야 한다", async ({
			page,
		}) => {
			// Given: 비디오 타입 에셋 상세 페이지 진입 (비디오 에셋 ID 필요)
			const VIDEO_ASSET_ID = "00000000-0000-0000-0000-000000000002";
			await page.goto(`./assets/${VIDEO_ASSET_ID}`);

			// Then: 비디오 상세 정보 확인 (duration, codec 등)
			const videoInfo = page.getByText(/재생 시간|길이|코덱/);
			if (await videoInfo.isVisible()) {
				await expect(videoInfo).toBeVisible();
			}
		});

		test.skip("문서 에셋의 경우 문서 상세 정보가 표시되어야 한다", async ({
			page,
		}) => {
			// Given: 문서 타입 에셋 상세 페이지 진입 (문서 에셋 ID 필요)
			const DOCUMENT_ASSET_ID = "00000000-0000-0000-0000-000000000003";
			await page.goto(`./assets/${DOCUMENT_ASSET_ID}`);

			// Then: 문서 상세 정보 확인 (페이지 수 등)
			const docInfo = page.getByText(/페이지|용량/);
			if (await docInfo.isVisible()) {
				await expect(docInfo).toBeVisible();
			}
		});
	});

	test.describe("폴더 위치 정보", () => {
		test.skip("에셋의 폴더 위치가 표시되어야 한다", async ({ page }) => {
			// Given: 에셋 상세 페이지 진입
			await page.goto(`./assets/${TEST_ASSET_ID}`);

			// Then: 폴더 위치 표시
			const locationInfo = page.getByText(/위치|폴더|경로/);
			await expect(locationInfo).toBeVisible();
		});

		test.skip("폴더 위치 클릭 시 해당 폴더로 이동해야 한다", async ({
			page,
		}) => {
			// Given: 에셋 상세 페이지 진입
			await page.goto(`./assets/${TEST_ASSET_ID}`);

			// When: 폴더 위치 링크 클릭
			const folderLink = page
				.getByRole("link")
				.filter({ hasText: /폴더|폴더명/ })
				.first();
			if (await folderLink.isVisible()) {
				await folderLink.click();

				// Then: 에셋 목록 페이지의 해당 폴더로 이동
				await expect(page).toHaveURL(/\/assets\?folderId=/);
			}
		});
	});

	test.describe("수정 기능", () => {
		test.skip("수정 버튼 클릭 시 수정 페이지로 이동해야 한다", async ({
			page,
		}) => {
			// Given: 에셋 상세 페이지 진입
			await page.goto(`./assets/${TEST_ASSET_ID}`);

			// When: 수정 버튼 클릭
			const editButton = page.getByRole("button", { name: /수정|편집/ });
			await editButton.click();

			// Then: 수정 페이지로 이동
			await expect(page).toHaveURL(/\/edit/);
		});
	});

	test.describe("삭제 기능", () => {
		test.skip("삭제 버튼 클릭 시 확인 다이얼로그가 표시되어야 한다", async ({
			page,
		}) => {
			// Given: 에셋 상세 페이지 진입
			await page.goto(`./assets/${TEST_ASSET_ID}`);

			// When: 삭제 버튼 클릭
			const deleteButton = page.getByRole("button", { name: /삭제/ });
			await deleteButton.click();

			// Then: 확인 다이얼로그 표시
			const confirmDialog = page.getByRole("dialog");
			await expect(confirmDialog).toBeVisible();

			const confirmMessage = page.getByText(/정말|확인|삭제하시겠습니까/);
			await expect(confirmMessage).toBeVisible();
		});

		test.skip("삭제 확인 시 에셋이 삭제되고 목록으로 이동해야 한다", async ({
			page,
		}) => {
			// Given: 에셋 상세 페이지 진입
			await page.goto(`./assets/${TEST_ASSET_ID}`);

			// When: 삭제 버튼 클릭 후 확인
			const deleteButton = page.getByRole("button", { name: /삭제/ });
			await deleteButton.click();

			const confirmButton = page
				.getByRole("dialog")
				.getByRole("button", { name: /확인|삭제/ });
			await confirmButton.click();

			// Then: 목록 페이지로 이동
			await expect(page).toHaveURL(/\/assets$/);
			await expect(page).not.toHaveURL(new RegExp(TEST_ASSET_ID));
		});

		test.skip("삭제 취소 시 다이얼로그가 닫혀야 한다", async ({ page }) => {
			// Given: 에셋 상세 페이지 진입
			await page.goto(`./assets/${TEST_ASSET_ID}`);

			// When: 삭제 버튼 클릭 후 취소
			const deleteButton = page.getByRole("button", { name: /삭제/ });
			await deleteButton.click();

			const cancelButton = page
				.getByRole("dialog")
				.getByRole("button", { name: /취소/ });
			await cancelButton.click();

			// Then: 다이얼로그 닫힘, 여전히 상세 페이지
			await expect(page.getByRole("dialog")).not.toBeVisible();
			await expect(page).toHaveURL(new RegExp(TEST_ASSET_ID));
		});
	});

	test.describe("다운로드 기능", () => {
		test.skip("다운로드 버튼이 표시되어야 한다", async ({ page }) => {
			// Given: 에셋 상세 페이지 진입
			await page.goto(`./assets/${TEST_ASSET_ID}`);

			// Then: 다운로드 버튼 확인
			const downloadButton = page.getByRole("button", {
				name: /다운로드|저장/,
			});
			await expect(downloadButton).toBeVisible();
		});
	});

	test.describe("목록으로 돌아가기", () => {
		test.skip("뒤로가기 버튼 클릭 시 목록으로 이동해야 한다", async ({
			page,
		}) => {
			// Given: 에셋 상세 페이지 진입
			await page.goto(`./assets/${TEST_ASSET_ID}`);

			// When: 뒤로가기 버튼 클릭
			const backButton = page.getByRole("button", { name: /뒤로|목록|이전/ });
			await backButton.click();

			// Then: 목록 페이지로 이동
			await expect(page).toHaveURL(/\/assets$/);
		});
	});
});

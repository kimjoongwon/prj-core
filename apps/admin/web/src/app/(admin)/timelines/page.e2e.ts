import { expect, test } from "@playwright/test";

const ADMIN_API_BASE_URL = "http://localhost:3000/api/v1";

test.describe("타임라인 목록 페이지", () => {
	// ── E2E-001: 목록 렌더링 ──

	test.describe("[E2E-001] 목록 렌더링", () => {
		test("타임라인 목록 페이지가 정상 렌더링되어야 한다", async ({ page }) => {
			// Given: 타임라인 목록 페이지 진입
			await page.goto("./timelines");
			await page.waitForLoadState("networkidle");

			// Then: 타이틀과 설명 확인
			await expect(
				page.getByRole("heading", { name: "타임라인" }),
			).toBeVisible();
			await expect(
				page.getByText("학기/시즌 단위 타임라인을 관리합니다."),
			).toBeVisible();
		});

		test("타임라인 등록 버튼이 표시되어야 한다", async ({ page }) => {
			// Given: 타임라인 목록 페이지 진입
			await page.goto("./timelines");
			await page.waitForLoadState("networkidle");

			// Then: 타임라인 등록 버튼 확인
			await expect(
				page.getByRole("button", { name: "타임라인 등록" }),
			).toBeVisible();
		});

		test("검색 입력 필드가 표시되어야 한다", async ({ page }) => {
			// Given: 타임라인 목록 페이지 진입
			await page.goto("./timelines");
			await page.waitForLoadState("networkidle");

			// Then: 검색 필드 확인
			await expect(
				page.getByPlaceholder("타임라인 이름으로 검색..."),
			).toBeVisible();
		});
	});

	// ── E2E-002: 타임라인 CRUD 플로우 ──

	test.describe("[E2E-002] 타임라인 CRUD 플로우", () => {
		test("타임라인 등록 → 상세 → 수정 → 삭제 전체 플로우", async ({ page }) => {
			const uniqueSuffix = `${Date.now()}`.slice(-6);
			const TEST_NAME = `E2E 테스트 타임라인 ${uniqueSuffix}`;
			const TEST_DESCRIPTION = "E2E 테스트용 타임라인 설명입니다.";
			const UPDATED_NAME = `E2E 수정된 타임라인 ${uniqueSuffix}`;

			// Given: 타임라인 API로 테스트 데이터를 생성
			const createResponse = await page.request.post(
				`${ADMIN_API_BASE_URL}/timelines`,
				{
					data: {
						name: TEST_NAME,
						description: TEST_DESCRIPTION,
					},
				},
			);
			expect(createResponse.status()).toBe(201);
			const createResponseBody = (await createResponse.json()) as {
				data?: { id?: string };
			};
			const timelineId = createResponseBody.data?.id;
			expect(timelineId).toBeTruthy();

			// When: 타임라인 목록에서 생성된 항목의 상세 페이지로 이동
			await page.goto("./timelines");
			await page.waitForLoadState("networkidle");
			const createdTimelineRow = page
				.getByRole("row")
				.filter({ has: page.getByText(TEST_NAME, { exact: true }) })
				.first();
			await expect(createdTimelineRow).toBeVisible({ timeout: 10_000 });
			await Promise.all([
				page.waitForURL(new RegExp(`/timelines/${timelineId}$`), {
					timeout: 30_000,
				}),
				createdTimelineRow.getByRole("button", { name: "상세" }).click(),
			]);

			// Then: 등록한 정보 확인
			await expect(
				page.getByRole("heading", { name: TEST_NAME, exact: true }),
			).toBeVisible({ timeout: 30000 });

			// ── 수정 플로우 ──

			// When: 수정 버튼 클릭
			await page.getByRole("button", { name: "수정" }).click();
			await page.waitForURL(/\/timelines\/.*\/edit/, { timeout: 15000 });
			await page.waitForLoadState("networkidle");

			// Then: 수정 페이지 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "타임라인 수정" }),
			).toBeVisible({ timeout: 10000 });

			// Then: 수정 폼 초기값 확인
			const editNameInput = page.getByRole("textbox", { name: /^타임라인명/ });
			await expect(editNameInput).toHaveValue(TEST_NAME);

			// When: 타임라인 API로 수정
			const updateResponse = await page.request.patch(
				`${ADMIN_API_BASE_URL}/timelines/${timelineId}`,
				{
					data: {
						name: UPDATED_NAME,
						description: TEST_DESCRIPTION,
					},
				},
			);
			expect(updateResponse.status()).toBe(200);

			// Then: 목록으로 돌아가 최신 데이터 확인
			await page.goto("./timelines");
			await page.waitForLoadState("networkidle");

			await expect(
				page.getByText(UPDATED_NAME, { exact: true }),
			).toBeVisible({ timeout: 30000 });

			// ── 삭제 플로우 ──

			const deleteResponse = await page.request.delete(
				`${ADMIN_API_BASE_URL}/timelines/${timelineId}`,
			);
			expect(deleteResponse.status()).toBe(204);

			// Then: 목록 페이지로 이동
			await page.goto("./timelines");
			await page.waitForLoadState("networkidle");

			await expect(page.getByRole("heading", { name: "타임라인" })).toBeVisible(
				{ timeout: 10000 },
			);

			// Then: 삭제된 타임라인명이 목록에 없음
			await expect(
				page.getByText(UPDATED_NAME, { exact: true }),
			).not.toBeVisible();
		});
	});
});

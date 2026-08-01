import { getAdminSpaceRequestHeaders } from "@cocrepo/e2e";
import { expect, test } from "@playwright/test";

const ADMIN_API_BASE_URL = "http://localhost:3000/api/v1";
const SYSTEM_TENANT_ID =
	process.env.E2E_SYSTEM_TENANT_ID ?? "01J00000000000000000000002";
const getSpaceHeaders = () => getAdminSpaceRequestHeaders(SYSTEM_TENANT_ID);
const TEST_VIDEO_FILE_ID = "11111111-1111-4111-8111-111111111111";

test.describe("태스크 목록 페이지", () => {
	// ── E2E-001: 목록 렌더링 ──

	test.describe("[E2E-001] 목록 렌더링", () => {
		test("태스크 목록 페이지가 정상 렌더링되어야 한다", async ({ page }) => {
			// Given: 태스크 목록 페이지 진입
			await page.goto("./tasks");
			await page.waitForLoadState("networkidle");

			// Then: 타이틀과 설명 확인
			await expect(
				page.getByRole("heading", { name: "태스크 목록" }),
			).toBeVisible();
			await expect(
				page.getByText("시스템에 등록된 태스크와 운동 detail을 관리합니다."),
			).toBeVisible();
		});

		test("태스크 등록 버튼이 표시되어야 한다", async ({ page }) => {
			// Given: 태스크 목록 페이지 진입
			await page.goto("./tasks");
			await page.waitForLoadState("networkidle");

			// Then: 태스크 등록 버튼 확인
			await expect(
				page.getByRole("button", { name: "태스크 등록" }),
			).toBeVisible();
		});

		test("검색 입력 필드가 표시되어야 한다", async ({ page }) => {
			// Given: 태스크 목록 페이지 진입
			await page.goto("./tasks");
			await page.waitForLoadState("networkidle");

			// Then: 검색 필드 확인
			await expect(page.getByPlaceholder("운동명으로 검색...")).toBeVisible();
		});
	});

	// ── E2E-002: 태스크 CRUD 플로우 ──

	test.describe("[E2E-002] 태스크 CRUD 플로우", () => {
		test("태스크 등록 → 운동 detail 조회 → 수정 → 삭제 전체 플로우", async ({
			page,
		}) => {
			const uniqueSuffix = `${Date.now()}`.slice(-6);
			const TEST_NAME = `E2E Task Alpha ${uniqueSuffix}`;
			const UPDATED_NAME = `E2E Task Beta ${uniqueSuffix}`;
			const TEST_DURATION = 30;
			const TEST_COUNT = 5;

			// Given: 태스크 API로 테스트 데이터를 생성
			const createResponse = await page.request.post(
				`${ADMIN_API_BASE_URL}/tasks`,
				{
					headers: getSpaceHeaders(),
					data: {
						name: TEST_NAME,
						duration: TEST_DURATION,
						count: TEST_COUNT,
						videoFileId: TEST_VIDEO_FILE_ID,
					},
				},
			);
			expect(createResponse.status()).toBe(201);
			const createResponseBody = (await createResponse.json()) as {
				data?: { id?: string };
			};
			const taskId = createResponseBody.data?.id;
			expect(taskId).toBeTruthy();

			// When: 생성된 태스크 상세 페이지로 이동
			await page.goto(`http://localhost:3000/admin/tasks/${taskId}/exercise`, {
				waitUntil: "domcontentloaded",
			});
			await page.waitForLoadState("networkidle");

			// Then: 상세 페이지 로드 확인
			await expect(page.getByRole("button", { name: "수정" })).toBeVisible({
				timeout: 30000,
			});
			await expect(page.getByRole("heading", { name: TEST_NAME })).toBeVisible({
				timeout: 30000,
			});

			// ── 수정 플로우 ──

			// When: 수정 버튼 클릭
			await page.getByRole("button", { name: "수정" }).click();
			await page
				.waitForURL(/\/tasks\/.*\/exercise\/edit/, { timeout: 5000 })
				.catch(async () => {
					await page.goto(
						`http://localhost:3000/admin/tasks/${taskId}/exercise/edit`,
						{ waitUntil: "domcontentloaded" },
					);
				});
			await page.waitForLoadState("networkidle");

			// Then: 수정 페이지 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "운동 정보 수정" }),
			).toBeVisible({ timeout: 10000 });

			// Then: 수정 폼 초기값 확인
			const editNameInput = page.getByLabel("운동명");
			await expect(editNameInput).toHaveValue(TEST_NAME);

			// When: 운동 detail API로 수정
			const updateResponse = await page.request.patch(
				`${ADMIN_API_BASE_URL}/tasks/${taskId}/exercise`,
				{
					headers: getSpaceHeaders(),
					data: {
						name: UPDATED_NAME,
						duration: TEST_DURATION,
						count: TEST_COUNT,
						videoFileId: TEST_VIDEO_FILE_ID,
					},
				},
			);
			expect(updateResponse.status()).toBe(200);

			// Then: 상세 페이지로 돌아가 최신 데이터 확인
			await page.goto(`http://localhost:3000/admin/tasks/${taskId}/exercise`);
			await page.waitForLoadState("networkidle");

			await expect(
				page.getByRole("heading", { name: UPDATED_NAME }),
			).toBeVisible({ timeout: 30000 });

			// ── 삭제 플로우 ──
			const deleteResponse = await page.request.delete(
				`${ADMIN_API_BASE_URL}/tasks/${taskId}`,
				{ headers: getSpaceHeaders() },
			);
			expect(deleteResponse.status()).toBe(204);

			// Then: 목록 페이지로 이동
			await page.goto("./tasks");
			await page.waitForLoadState("networkidle");

			await expect(
				page.getByRole("heading", { name: "태스크 목록" }),
			).toBeVisible({ timeout: 10000 });

			// Then: 삭제된 운동명이 목록에 없음
			await expect(
				page.getByText(UPDATED_NAME, { exact: true }),
			).not.toBeVisible();
		});
	});
});

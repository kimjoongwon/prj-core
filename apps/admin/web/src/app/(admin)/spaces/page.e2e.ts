import { expect, test } from "@playwright/test";

const ADMIN_API_BASE_URL = "http://localhost:3000/api/v1";

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
				page.getByText("시스템에 등록된 공간과 시설 detail을 관리합니다."),
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
				page.getByPlaceholder("시설명, 사업자등록번호로 검색..."),
			).toBeVisible();
		});
	});

	// ── E2E-002: 공간 CRUD 플로우 ──

	test.describe("[E2E-002] 공간 CRUD 플로우", () => {
		test("공간 등록 → 시설 detail 조회 → 수정 → 삭제 전체 플로우", async ({
			page,
		}) => {
			const uniqueSuffix = `${Date.now()}`;
			const TEST_NAME = `E2E 테스트 공간 ${uniqueSuffix.slice(-6)}`;
			const UPDATED_NAME = "E2E 수정된 공간";
			const TEST_BUSINESS_NO = `${uniqueSuffix.slice(-10, -7)}-${uniqueSuffix.slice(-7, -5)}-${uniqueSuffix.slice(-5)}`;
			const TEST_ADDRESS = "서울특별시 강남구 테스트로 1";
			const TEST_PHONE = "02-0000-0001";
			const TEST_EMAIL = `e2e-test-space-${uniqueSuffix}@example.com`;
			// 시드 데이터 기준 System Space ID (로그인 헬퍼와 동일)
			const SYSTEM_SPACE_ID = "61ddca20-1752-466e-b4da-879ebdbe54e3";
			const spaceHeaders = { Cookie: `selectedSpaceId=${SYSTEM_SPACE_ID}` };

			// Given: 공간 API로 테스트 데이터를 생성
			const createResponse = await page.request.post(
				`${ADMIN_API_BASE_URL}/spaces`,
				{
					headers: spaceHeaders,
					data: {
						name: TEST_NAME,
						label: null,
						address: TEST_ADDRESS,
						phone: TEST_PHONE,
						email: TEST_EMAIL,
						businessNo: TEST_BUSINESS_NO,
						spaceId: "",
					},
				},
			);
			expect(createResponse.status()).toBe(201);
			const createResponseBody = (await createResponse.json()) as {
				data?: { id?: string };
			};
			const spaceId = createResponseBody.data?.id;
			expect(spaceId).toBeTruthy();

			// When: 생성된 공간의 상세 페이지로 이동
			await page.goto(`http://localhost:3000/admin/spaces/${spaceId}/ground`);
			await page.waitForLoadState("networkidle");

			// Then: 등록한 정보 확인
			await expect(
				page.getByRole("heading", { name: TEST_NAME, exact: true }),
			).toBeVisible({ timeout: 10000 });
			await expect(
				page.getByText(TEST_BUSINESS_NO, { exact: true }),
			).toBeVisible();

			// ── 수정 플로우 ──

			// When: 수정 버튼 클릭
			await page.getByRole("button", { name: "수정" }).click();
			await page.waitForURL(/\/spaces\/.*\/ground\/edit/, { timeout: 15000 });
			await page.waitForLoadState("networkidle");

			// Then: 수정 페이지 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "시설 정보 수정" }),
			).toBeVisible({ timeout: 10000 });

			// Then: 수정 폼 초기값 확인
			const nameInput = page.getByLabel("시설명");
			await expect(nameInput).toHaveValue(TEST_NAME);

			// When: 시설 detail API로 수정
			const updateResponse = await page.request.patch(
				`${ADMIN_API_BASE_URL}/spaces/${spaceId}/ground`,
				{
					headers: spaceHeaders,
					data: {
						name: UPDATED_NAME,
						label: null,
						address: TEST_ADDRESS,
						phone: TEST_PHONE,
						email: TEST_EMAIL,
					},
				},
			);
			expect(updateResponse.status()).toBe(200);

			// Then: 상세 페이지로 돌아가 최신 데이터 확인
			await page.goto(`http://localhost:3000/admin/spaces/${spaceId}/ground`);
			await page.waitForLoadState("networkidle");

			await expect(
				page.getByRole("heading", {
					name: UPDATED_NAME,
					exact: true,
				}),
			).toBeVisible({ timeout: 10000 });

			// ── 삭제 플로우 (API 직접 호출) ──

			const deleteResp = await page.request.delete(
				`${ADMIN_API_BASE_URL}/spaces/${spaceId}`,
				{ headers: spaceHeaders },
			);
			expect(deleteResp.status()).toBe(200);

			// Then: 목록 페이지로 이동하여 삭제 확인
			await page.goto("./spaces");
			await page.waitForLoadState("networkidle");

			await expect(
				page.getByRole("heading", { name: "공간 목록" }),
			).toBeVisible({ timeout: 10000 });

			// Then: 삭제된 시설 사업자등록번호가 목록에 없음
			await expect(
				page.getByText(TEST_BUSINESS_NO, { exact: true }),
			).not.toBeVisible();
		});
	});
});

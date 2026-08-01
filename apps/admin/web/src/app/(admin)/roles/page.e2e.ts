import { getAdminSpaceRequestHeaders } from "@cocrepo/e2e";
import { expect, type Page, test } from "@playwright/test";

const ADMIN_API_BASE_URL = new URL(
	"/api/v1",
	process.env.E2E_CORE_API_BASE_URL ?? "http://localhost:3000/",
).toString();
const SYSTEM_TENANT_ID =
	process.env.E2E_SYSTEM_TENANT_ID ?? "01J00000000000000000000002";
const getSpaceHeaders = () => getAdminSpaceRequestHeaders(SYSTEM_TENANT_ID);
const roleListHeading = (page: Page) =>
	page.getByRole("heading", { name: "역할 목록", exact: true });

const gotoRoleListPage = async (page: Page) => {
	await page.goto("./roles", { waitUntil: "domcontentloaded" });
	try {
		await expect(roleListHeading(page)).toBeVisible({ timeout: 15000 });
	} catch {
		await page.reload({ waitUntil: "domcontentloaded" });
		await expect(roleListHeading(page)).toBeVisible({ timeout: 20000 });
	}
};

test.describe("역할 목록 페이지", () => {
	// ── E2E-001: 목록 렌더링 ──

	test.describe("[E2E-001] 목록 렌더링", () => {
		test("역할 목록 페이지가 정상 렌더링되어야 한다", async ({ page }) => {
			// Given: 역할 목록 페이지 진입
			await gotoRoleListPage(page);

			// Then: 타이틀과 설명 확인
			await expect(roleListHeading(page)).toBeVisible();
			await expect(
				page.getByText("시스템에 등록된 역할을 관리합니다."),
			).toBeVisible();
		});

		test("시드 데이터의 시스템 역할이 표시되어야 한다", async ({ page }) => {
			// Given: 역할 목록 페이지 진입
			await gotoRoleListPage(page);

			// Then: 시스템 역할 3종 확인 (exact: true로 info 텍스트의 부분 매칭 방지)
			await expect(
				page.getByText("PLATFORM_ADMIN", { exact: true }),
			).toBeVisible();
			await expect(
				page.getByText("COMPANY_MANAGER", { exact: true }),
			).toBeVisible();
			await expect(page.getByText("MEMBER", { exact: true })).toBeVisible();
		});

		test("역할 추가 버튼이 표시되어야 한다", async ({ page }) => {
			// Given: 역할 목록 페이지 진입
			await gotoRoleListPage(page);

			// Then: 역할 추가 버튼 확인
			await expect(
				page.getByRole("button", { name: "역할 추가" }),
			).toBeVisible();
		});
	});

	// ── E2E-002: 역할 등록 플로우 ──

	test.describe("[E2E-002] 역할 등록 플로우 @real", () => {
		test("역할 등록 → 상세 → 수정 → 삭제 전체 플로우", async ({ page }) => {
			// 고유한 역할 이름 사용 (타임스탬프로 충돌 방지)
			const uniqueSuffix = `${Date.now()}`.slice(-6);
			const TEST_ROLE_NAME = `E2E_TEST_ROLE_${uniqueSuffix}`;
			const INITIAL_DISPLAY_NAME = "E2E 테스트";
			const UPDATED_DISPLAY_NAME = "Modified";

			// Given: 역할 API로 테스트 데이터를 생성
			const createResponse = await page.request.post(
				`${ADMIN_API_BASE_URL}/roles`,
				{
					headers: getSpaceHeaders(),
					data: {
						name: TEST_ROLE_NAME,
						displayName: INITIAL_DISPLAY_NAME,
						description: "E2E 테스트 역할입니다.",
					},
				},
			);
			const createResponseText = await createResponse.text();
			expect(createResponse.status(), createResponseText).toBe(201);
			const createResponseBody = JSON.parse(createResponseText) as {
				data?: { id?: string };
			};
			const roleId = createResponseBody.data?.id;
			expect(roleId).toBeTruthy();

			// When: 역할 목록 페이지로 이동
			await gotoRoleListPage(page);

			// Then: 역할 목록 확인
			await expect(roleListHeading(page)).toBeVisible({ timeout: 10000 });

			// Then: 새로 등록된 역할이 목록에 표시됨
			const createdRoleRow = page
				.getByRole("row")
				.filter({ has: page.getByText(TEST_ROLE_NAME, { exact: true }) })
				.first();
			await expect(createdRoleRow).toBeVisible();

			// When: 새로 등록된 역할 행의 상세 버튼 클릭
			const detailAction = createdRoleRow
				.getByRole("link", { name: "상세" })
				.or(createdRoleRow.getByRole("button", { name: "상세" }))
				.first();
			await detailAction.click();
			await page.waitForLoadState("networkidle");

			// Then: 상세 페이지 확인
			await expect(
				page.getByRole("heading", { name: "역할 상세" }),
			).toBeVisible({ timeout: 10000 });
			await expect(page.getByText(TEST_ROLE_NAME)).toBeVisible();
			await expect(
				page.getByText(INITIAL_DISPLAY_NAME, { exact: true }),
			).toBeVisible();

			// When: 수정 버튼 클릭 (client-side navigation)
			await page.getByRole("button", { name: "수정" }).click();
			await page.waitForURL(/\/roles\/.*\/edit/, { timeout: 15000 });
			await page.waitForLoadState("networkidle");

			// Then: 수정 페이지 확인
			await expect(
				page.getByRole("heading", { name: "역할 수정" }),
			).toBeVisible({ timeout: 10000 });

			// Then: 수정 화면의 초기값 확인
			const displayNameInput = page.getByRole("textbox", { name: "표시명" });
			await expect(displayNameInput).toHaveValue(INITIAL_DISPLAY_NAME);

			// When: 역할 API로 표시명을 수정
			const updateResponse = await page.request.patch(
				`${ADMIN_API_BASE_URL}/roles/${roleId}`,
				{
					headers: getSpaceHeaders(),
					data: {
						displayName: UPDATED_DISPLAY_NAME,
					},
				},
			);
			expect(updateResponse.status()).toBe(200);

			// Then: 상세 페이지로 이동하여 최신 데이터 확인
			await page.goto(`./roles/${roleId}`, { waitUntil: "domcontentloaded" });
			await page.waitForLoadState("networkidle");
			await expect(
				page.getByRole("heading", { name: "역할 상세" }),
			).toBeVisible({ timeout: 10000 });

			// Then: 수정된 값 확인
			await expect(
				page.getByText(UPDATED_DISPLAY_NAME, { exact: true }),
			).toBeVisible({ timeout: 10000 });

			// When: 삭제 버튼 클릭
			await page.getByRole("button", { name: "삭제" }).click();

			await page.waitForURL(/\/roles\/?$/, { timeout: 15000 });
			await page.waitForLoadState("networkidle");

			// Then: 역할 목록으로 이동, 삭제된 역할 없음 확인
			await expect(
				page.getByRole("heading", { name: "역할 목록", exact: true }),
			).toBeVisible({ timeout: 10000 });
			await expect(
				page.getByText(TEST_ROLE_NAME, { exact: true }),
			).not.toBeVisible();
		});
	});

	// ── E2E-004: 시스템 역할 보호 확인 ──

	test.describe("[E2E-004] 시스템 역할 보호", () => {
		test("시스템 역할 목록에서 시스템 뱃지가 표시되어야 한다", async ({
			page,
		}) => {
			// Given: 역할 목록 페이지
			await gotoRoleListPage(page);

			// Then: 시스템 뱃지 확인 (시스템 역할 3개에 대해)
			const systemChips = page.getByText("시스템", { exact: true });
			await expect(systemChips.first()).toBeVisible();
		});
	});

	// ── E2E-005: Company 관리자 권한 제한 확인 ──

	test.describe("[E2E-005] Company 관리자 권한 제한", () => {
		test.skip(true, "COMPANY_MANAGER 사용자 로그인 설정 필요");

		test("역할 추가 버튼이 숨겨져야 한다", async ({ page }) => {
			// Given: COMPANY_MANAGER 사용자로 역할 목록 진입
			await gotoRoleListPage(page);

			// Then: 역할 추가 버튼 숨김
			await expect(
				page.getByRole("button", { name: "역할 추가" }),
			).not.toBeVisible();
		});
	});
});

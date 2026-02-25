import { test, expect } from "@playwright/test";

test.describe("역할 목록 페이지", () => {
	// ── E2E-001: 목록 렌더링 ──

	test.describe("[E2E-001] 목록 렌더링", () => {
		test("역할 목록 페이지가 정상 렌더링되어야 한다", async ({ page }) => {
			// Given: 역할 목록 페이지 진입
			await page.goto("./roles");
			await page.waitForLoadState("networkidle");

			// Then: 타이틀과 설명 확인
			await expect(
				page.getByRole("heading", { name: "역할 목록" }),
			).toBeVisible();
			await expect(
				page.getByText("시스템에 등록된 역할을 관리합니다."),
			).toBeVisible();
		});

		test("시드 데이터의 시스템 역할이 표시되어야 한다", async ({ page }) => {
			// Given: 역할 목록 페이지 진입
			await page.goto("./roles");
			await page.waitForLoadState("networkidle");

			// Then: 시스템 역할 3종 확인 (exact: true로 info 텍스트의 부분 매칭 방지)
			await expect(
				page.getByText("FULL_ACCESS", { exact: true }),
			).toBeVisible();
			await expect(
				page.getByText("MANAGE", { exact: true }),
			).toBeVisible();
			await expect(
				page.getByText("VIEW", { exact: true }),
			).toBeVisible();
		});

		test("역할 추가 버튼이 표시되어야 한다", async ({ page }) => {
			// Given: 역할 목록 페이지 진입
			await page.goto("./roles");
			await page.waitForLoadState("networkidle");

			// Then: 역할 추가 버튼 확인
			await expect(
				page.getByRole("button", { name: "역할 추가" }),
			).toBeVisible();
		});
	});

	// ── E2E-002: 역할 등록 플로우 ──

	test.describe("[E2E-002] 역할 등록 플로우", () => {
		test("역할 등록 → 상세 → 수정 → 삭제 전체 플로우", async ({ page }) => {
			// 고유한 역할 이름 사용 (타임스탬프로 충돌 방지)
			const uniqueSuffix = `${Date.now()}`.slice(-6);
			const TEST_ROLE_NAME = `E2E_TEST_ROLE_${uniqueSuffix}`;

			// Given: 역할 등록 페이지로 이동
			await page.goto("./roles/new");
			await page.waitForLoadState("networkidle");

			// When: 폼 입력
			await page
				.getByRole("textbox", { name: /역할 식별자/ })
				.fill(TEST_ROLE_NAME);
			await page.getByRole("textbox", { name: "표시명" }).fill("E2E 테스트");

			// When: 역할 등록 버튼 클릭 (API 응답 대기)
			const createResponse = page.waitForResponse(
				(resp) =>
					resp.url().includes("/api/v1/roles") &&
					resp.request().method() === "POST",
			);
			await page.getByRole("button", { name: "역할 등록" }).click();
			const response = await createResponse;

			// Then: 201 Created 응답 확인
			expect(response.status()).toBe(201);

			// Then: 등록 후 목록 페이지로 리다이렉트 확인
			await page.waitForURL(/\/roles\/?$/, { timeout: 15000 });
			await page.waitForLoadState("networkidle");
			await expect(
				page.getByRole("heading", { name: "역할 목록" }),
			).toBeVisible({ timeout: 10000 });

			// Then: 새로 등록된 역할이 목록에 표시됨
			await expect(
				page.getByText(TEST_ROLE_NAME, { exact: true }),
			).toBeVisible();

			// When: 새로 등록된 역할 행의 상세 버튼 클릭 (마지막 행)
			await page.getByRole("button", { name: "상세" }).last().click();
			await page.waitForLoadState("networkidle");

			// Then: 상세 페이지 확인
			await expect(
				page.getByRole("heading", { name: "역할 상세" }),
			).toBeVisible({ timeout: 10000 });
			await expect(page.getByText(TEST_ROLE_NAME)).toBeVisible();
			await expect(
				page.getByText("E2E 테스트", { exact: true }),
			).toBeVisible();

			// When: 수정 버튼 클릭 (client-side navigation)
			await page.getByRole("button", { name: "수정" }).click();
			await page.waitForURL(/\/roles\/.*\/edit/, { timeout: 15000 });
			await page.waitForLoadState("networkidle");

			// Then: 수정 페이지 확인
			await expect(
				page.getByRole("heading", { name: "역할 수정" }),
			).toBeVisible({ timeout: 10000 });

			// When: 표시명 수정
			const displayNameInput = page.getByRole("textbox", { name: "표시명" });
			await displayNameInput.click();
			await displayNameInput.press("Meta+a");
			await displayNameInput.pressSequentially("Modified", { delay: 50 });
			await page.waitForTimeout(500);

			// When: 저장 버튼 클릭 (API 응답 대기)
			const updateResponse = page.waitForResponse(
				(resp) =>
					resp.url().includes("/api/v1/roles/") &&
					resp.request().method() === "PATCH",
			);
			await page.getByRole("button", { name: "저장" }).click();
			await updateResponse;
			await page.waitForURL(/\/roles\/[^/]+$/, { timeout: 15000 });
			await page.waitForLoadState("networkidle");

			// Then: 상세 페이지로 복귀 확인
			await expect(
				page.getByRole("heading", { name: "역할 상세" }),
			).toBeVisible({ timeout: 10000 });

			// 페이지 리로드하여 캐시 없이 최신 데이터 확인
			await page.reload();
			await page.waitForLoadState("networkidle");

			// Then: 수정된 값 확인
			await expect(
				page.getByText("Modified", { exact: true }),
			).toBeVisible({ timeout: 10000 });

			// When: 삭제 버튼 클릭
			await page.getByRole("button", { name: "삭제" }).click();

			// When: 삭제 확인 모달에서 확인 클릭
			await page.waitForTimeout(500);
			await page.getByRole("button", { name: /확인|삭제/ }).last().click();
			await page.waitForURL(/\/roles\/?$/, { timeout: 15000 });
			await page.waitForLoadState("networkidle");

			// Then: 역할 목록으로 이동, 삭제된 역할 없음 확인
			await expect(
				page.getByRole("heading", { name: "역할 목록" }),
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
			await page.goto("./roles");
			await page.waitForLoadState("networkidle");

			// Then: 시스템 뱃지 확인 (시스템 역할 3개에 대해)
			const systemChips = page.getByText("시스템", { exact: true });
			await expect(systemChips.first()).toBeVisible();
		});
	});

	// ── E2E-005: 조회 권한 사용자 제한 확인 ──

	test.describe("[E2E-005] 조회 권한 제한 (MANAGE 사용자)", () => {
		test.skip(true, "MANAGE 사용자 로그인 설정 필요");

		test("역할 추가 버튼이 숨겨져야 한다", async ({ page }) => {
			// Given: MANAGE 사용자로 역할 목록 진입
			await page.goto("./roles");
			await page.waitForLoadState("networkidle");

			// Then: 역할 추가 버튼 숨김
			await expect(
				page.getByRole("button", { name: "역할 추가" }),
			).not.toBeVisible();
		});
	});
});

import { expect, test } from "@playwright/test";

function buildUniqueTemplateCode() {
	return `E2E_TEMPLATE_${Date.now()}`;
}

test.describe("메시지 템플릿 목록 페이지", () => {
	// ── E2E-001: 목록 렌더링 ──

	test.describe("[E2E-001] 목록 렌더링", () => {
		test("템플릿 목록 페이지가 정상 렌더링되어야 한다", async ({ page }) => {
			// Given: 템플릿 목록 페이지 진입
			await page.goto("./templates");
			await page.waitForLoadState("networkidle");

			// Then: 타이틀과 설명 확인
			await expect(
				page.getByRole("heading", { name: "메시지 템플릿" }),
			).toBeVisible();
			await expect(
				page.getByText("시스템에 등록된 메시지 템플릿을 관리합니다."),
			).toBeVisible();
		});

		test("템플릿 등록 버튼이 표시되어야 한다", async ({ page }) => {
			// Given: 템플릿 목록 페이지 진입
			await page.goto("./templates");
			await page.waitForLoadState("networkidle");

			// Then: 템플릿 등록 버튼 확인
			await expect(
				page.getByRole("button", { name: "템플릿 등록" }),
			).toBeVisible();
		});

		test("검색 입력 필드가 표시되어야 한다", async ({ page }) => {
			// Given: 템플릿 목록 페이지 진입
			await page.goto("./templates");
			await page.waitForLoadState("networkidle");

			// Then: 검색 필드 확인
			await expect(page.getByPlaceholder("이름, 코드로 검색...")).toBeVisible();
		});
	});

	// ── E2E-002: 템플릿 CRUD 플로우 ──

	test.describe("[E2E-002] 템플릿 CRUD 플로우", () => {
		test("템플릿 등록 → 상세 → 수정 → 삭제 전체 플로우", async ({ page }) => {
			const uniqueSuffix = `${Date.now()}`;
			const TEST_CODE = buildUniqueTemplateCode();
			const TEST_NAME = `E2E SMS 테스트 템플릿 ${uniqueSuffix}`;
			const TEST_CONTENT = "E2E 테스트 발송 메시지입니다.";

			// Given: 템플릿 등록 페이지로 이동
			await page.goto("./templates/new");
			await page.waitForLoadState("networkidle");

			// Then: 등록 페이지 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "템플릿 등록" }),
			).toBeVisible();

			// When: SMS 유형 선택
			await page.getByRole("radio", { name: "SMS" }).click();

			// When: 코드 입력
			await page.getByLabel("코드").fill(TEST_CODE);

			// When: 이름 입력
			await page.getByLabel("이름").fill(TEST_NAME);

			// When: 본문 입력 (SMS는 Textarea)
			await page.getByLabel("본문").fill(TEST_CONTENT);

			// When: 등록 버튼 클릭 (API 응답 대기)
			const createResponse = page.waitForResponse(
				(resp) =>
					resp.url().includes("/api/v1/templates") &&
					resp.request().method() === "POST",
			);
			await page.getByRole("button", { name: "등록" }).click();
			const response = await createResponse;

			// Then: 201 Created 응답 확인
			expect(response.status()).toBe(201);

			// Then: 상세 페이지로 이동 확인
			await page.waitForURL(/\/templates\/[^/]+$/, { timeout: 15000 });
			await page.waitForLoadState("networkidle");

			await expect(
				page.getByRole("heading", { name: "템플릿 상세" }),
			).toBeVisible({ timeout: 10000 });

			// Then: 등록한 정보 확인
			await expect(page.getByText(TEST_CODE, { exact: true })).toBeVisible();
			await expect(page.getByText(TEST_NAME, { exact: true })).toBeVisible();

			// ── 수정 플로우 ──

			// When: 수정 버튼 클릭
			await page.getByRole("button", { name: "수정" }).click();
			await page.waitForURL(/\/templates\/.*\/edit/, { timeout: 15000 });
			await page.waitForLoadState("networkidle");

			// Then: 수정 페이지 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "템플릿 수정" }),
			).toBeVisible({ timeout: 10000 });

			// When: 이름 수정
			const nameInput = page.getByLabel("이름");
			await nameInput.click();
			await nameInput.press("Meta+a");
			await nameInput.pressSequentially("E2E SMS 수정됨", { delay: 30 });
			await page.waitForTimeout(300);

			// When: 저장 버튼 클릭 (PATCH 응답 대기)
			const updateResponse = page.waitForResponse(
				(resp) =>
					resp.url().includes("/api/v1/templates/") &&
					resp.request().method() === "PATCH" &&
					!resp.url().includes("toggle"),
			);
			await page.getByRole("button", { name: "저장" }).click();
			const patchResp = await updateResponse;

			// Then: 200 OK 응답 확인
			expect(patchResp.status()).toBe(200);

			// Then: 상세 페이지로 복귀
			await page.waitForURL(/\/templates\/[^/]+$/, { timeout: 15000 });
			await page.waitForLoadState("networkidle");

			await expect(
				page.getByRole("heading", { name: "템플릿 상세" }),
			).toBeVisible({ timeout: 10000 });

			// 페이지 리로드하여 최신 데이터 확인
			await page.reload();
			await page.waitForLoadState("networkidle");

			await expect(
				page.getByText("E2E SMS 수정됨", { exact: true }),
			).toBeVisible({ timeout: 10000 });

			// ── 삭제 플로우 ──

			// When: 삭제 버튼 클릭
			await page.getByRole("button", { name: "삭제" }).click();

			// When: 삭제 확인 모달에서 삭제 버튼 클릭
			await page.waitForTimeout(500);

			const deleteResponse = page.waitForResponse(
				(resp) =>
					resp.url().includes("/api/v1/templates/") &&
					resp.request().method() === "DELETE",
			);
			await page.getByRole("button", { name: "삭제" }).last().click();
			const deleteResp = await deleteResponse;

			// Then: 204 No Content 응답 확인
			expect(deleteResp.status()).toBe(204);

			// Then: 목록 페이지로 이동
			await page.waitForURL(/\/templates\/?$/, { timeout: 15000 });
			await page.waitForLoadState("networkidle");

			await expect(
				page.getByRole("heading", { name: "메시지 템플릿" }),
			).toBeVisible({ timeout: 10000 });

			// Then: 삭제된 템플릿 코드가 목록에 없음
			await expect(
				page.getByText(TEST_CODE, { exact: true }),
			).not.toBeVisible();
		});
	});
});

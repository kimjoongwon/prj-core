import { expect, test } from "@playwright/test";

test.describe("루틴 목록 페이지", () => {
	// ── E2E-001: 목록 렌더링 ──

	test.describe("[E2E-001] 목록 렌더링", () => {
		test("루틴 목록 페이지가 정상 렌더링되어야 한다", async ({ page }) => {
			// Given: 루틴 목록 페이지 진입
			await page.goto("./routines");
			await page.waitForLoadState("networkidle");

			// Then: 타이틀과 설명 확인
			await expect(page.getByRole("heading", { name: "루틴" })).toBeVisible();
			await expect(
				page.getByText("운동 루틴(커리큘럼)을 관리합니다."),
			).toBeVisible();
		});

		test("루틴 등록 버튼이 표시되어야 한다", async ({ page }) => {
			// Given: 루틴 목록 페이지 진입
			await page.goto("./routines");
			await page.waitForLoadState("networkidle");

			// Then: 루틴 등록 버튼 확인
			await expect(
				page.getByRole("button", { name: "루틴 등록" }),
			).toBeVisible();
		});

		test("검색 입력 필드가 표시되어야 한다", async ({ page }) => {
			// Given: 루틴 목록 페이지 진입
			await page.goto("./routines");
			await page.waitForLoadState("networkidle");

			// Then: 검색 필드 확인
			await expect(page.getByPlaceholder("루틴명으로 검색...")).toBeVisible();
		});
	});

	// ── E2E-002: 루틴 CRUD 플로우 ──

	test.describe("[E2E-002] 루틴 CRUD 플로우", () => {
		test("루틴 등록 → 상세 → 수정 → 삭제 전체 플로우", async ({ page }) => {
			const TEST_NAME = "E2E 테스트 루틴";
			const TEST_LABEL = "E2E-TEST-LABEL";
			const UPDATED_NAME = "E2E 수정된 루틴";
			const UPDATED_LABEL = "E2E-UPDATED-LABEL";
			// 시드 데이터 기준 System Space ID (로그인 헬퍼와 동일)
			const SYSTEM_SPACE_ID = "61ddca20-1752-466e-b4da-879ebdbe54e3";
			const spaceHeaders = { "x-space-id": SYSTEM_SPACE_ID };

			const clickSaveWithOptionalEmptyActivitiesConfirm = async () => {
				await page.getByRole("button", { name: "저장" }).click();

				const confirmSaveButton = page.getByRole("button", {
					name: "저장 진행",
				});
				if (await confirmSaveButton.isVisible().catch(() => false)) {
					await confirmSaveButton.click();
				}
			};

			// Cleanup: 기존 E2E 테스트 루틴 삭제
			try {
				const resp = await page.request.get(
					"http://localhost:3000/api/v1/routines",
					{ headers: spaceHeaders },
				);
				const body = await resp.json();
				const routines = body.data ?? [];
				for (const routine of routines as { id: string; name: string }[]) {
					if (routine.name === TEST_NAME || routine.name === UPDATED_NAME) {
						await page.request.delete(
							`http://localhost:3000/api/v1/routines/${routine.id}`,
							{ headers: spaceHeaders },
						);
					}
				}
			} catch {
				// cleanup 실패해도 계속 진행
			}

			// Given: 루틴 등록 페이지로 이동
			await page.goto("./routines/new");
			await page.waitForLoadState("networkidle");

			// Then: 등록 페이지 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "루틴 등록" }),
			).toBeVisible();

			// When: 루틴 이름 입력
			await page.getByLabel("루틴 이름").fill(TEST_NAME);

			// When: 단축 라벨 입력
			await page.getByLabel("단축 라벨").fill(TEST_LABEL);

			// When: 저장 버튼 클릭 (API 응답 대기)
			const createResponse = page.waitForResponse(
				(resp) =>
					resp.url().includes("/api/v1/routines") &&
					resp.request().method() === "POST",
			);
			await clickSaveWithOptionalEmptyActivitiesConfirm();
			const response = await createResponse;

			// Then: 201 Created 응답 확인
			expect(response.status()).toBe(201);

			// Then: 상세 페이지로 이동 확인
			await page.waitForURL(/\/routines\/[^/]+$/, { timeout: 15000 });
			await page.waitForLoadState("networkidle");

			// Then: 등록한 정보 확인
			await expect(
				page.getByRole("heading", { name: TEST_NAME, exact: true }),
			).toBeVisible({ timeout: 10000 });
			await expect(page.getByText(TEST_LABEL, { exact: true })).toBeVisible();

			// ── 수정 플로우 ──

			// When: 수정 버튼 클릭
			await page.getByRole("button", { name: "수정" }).click();
			await page.waitForURL(/\/routines\/.*\/edit/, { timeout: 15000 });
			await page.waitForLoadState("networkidle");

			// Then: 수정 페이지 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "루틴 수정" }),
			).toBeVisible({ timeout: 10000 });

			// When: 루틴명 수정
			const nameInput = page.getByLabel("루틴 이름");
			await nameInput.click();
			await nameInput.press("Meta+a");
			await nameInput.pressSequentially(UPDATED_NAME, { delay: 30 });

			// When: 단축 라벨 수정
			const labelInput = page.getByLabel("단축 라벨");
			await labelInput.click();
			await labelInput.press("Meta+a");
			await labelInput.pressSequentially(UPDATED_LABEL, { delay: 30 });
			await page.waitForTimeout(300);

			// When: 저장 버튼 클릭 (PATCH 응답 대기)
			const updateResponse = page.waitForResponse(
				(resp) =>
					resp.url().includes("/api/v1/routines/") &&
					resp.request().method() === "PATCH",
			);
			await clickSaveWithOptionalEmptyActivitiesConfirm();
			const patchResp = await updateResponse;

			// Then: 200 OK 응답 확인
			expect(patchResp.status()).toBe(200);

			// Then: 상세 페이지로 복귀
			await page.waitForURL(/\/routines\/[^/]+$/, { timeout: 15000 });
			await page.waitForLoadState("networkidle");

			// 페이지 리로드하여 최신 데이터 확인
			await page.reload();
			await page.waitForLoadState("networkidle");

			await expect(
				page.getByRole("heading", { name: UPDATED_NAME, exact: true }),
			).toBeVisible({ timeout: 10000 });

			// ── 삭제 플로우 ──

			// When: 삭제 버튼 클릭
			await page.getByRole("button", { name: "삭제" }).click();

			// When: 삭제 확인 모달에서 삭제 버튼 클릭
			await page.waitForTimeout(500);

			const deleteResponse = page.waitForResponse(
				(resp) =>
					resp.url().includes("/api/v1/routines/") &&
					resp.request().method() === "DELETE",
			);
			await page.getByRole("button", { name: "삭제" }).last().click();
			const deleteResp = await deleteResponse;

			// Then: 204 No Content 응답 확인
			expect(deleteResp.status()).toBe(204);

			// Then: 목록 페이지로 이동
			await page.waitForURL(/\/routines\/?$/, { timeout: 15000 });
			await page.waitForLoadState("networkidle");

			await expect(page.getByRole("heading", { name: "루틴" })).toBeVisible({
				timeout: 10000,
			});

			// Then: 삭제된 루틴명이 목록에 없음
			await expect(
				page.getByText(UPDATED_NAME, { exact: true }),
			).not.toBeVisible();
		});
	});
});

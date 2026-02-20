import { expect, test } from "@playwright/test";

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
			const TEST_NAME = "E2E 테스트 타임라인";
			const TEST_DESCRIPTION = "E2E 테스트용 타임라인 설명입니다.";
			const UPDATED_NAME = "E2E 수정된 타임라인";
			// 시드 데이터 기준 System Space ID (로그인 헬퍼와 동일)
			const SYSTEM_SPACE_ID = "61ddca20-1752-466e-b4da-879ebdbe54e3";
			const spaceHeaders = { "x-space-id": SYSTEM_SPACE_ID };

			// Cleanup: 기존 E2E 테스트 타임라인 삭제
			try {
				const resp = await page.request.get(
					"http://localhost:3000/api/v1/timelines",
					{ headers: spaceHeaders },
				);
				const body = await resp.json();
				const timelines = body.data ?? [];
				for (const timeline of timelines as {
					id: string;
					name: string;
				}[]) {
					if (timeline.name === TEST_NAME || timeline.name === UPDATED_NAME) {
						await page.request.delete(
							`http://localhost:3000/api/v1/timelines/${timeline.id}`,
							{ headers: spaceHeaders },
						);
					}
				}
			} catch {
				// cleanup 실패해도 계속 진행
			}

			// Given: 타임라인 등록 페이지로 이동
			await page.goto("./timelines/new");
			await page.waitForLoadState("networkidle");

			// Then: 등록 페이지 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "타임라인 등록" }),
			).toBeVisible();

			// When: 타임라인명 입력
			await page.getByLabel("타임라인명").fill(TEST_NAME);

			// When: 설명 입력
			await page.getByLabel("설명").fill(TEST_DESCRIPTION);

			// When: 등록 버튼 클릭 (API 응답 대기)
			const createResponse = page.waitForResponse(
				(resp) =>
					resp.url().includes("/api/v1/timelines") &&
					resp.request().method() === "POST",
			);
			await page.getByRole("button", { name: "등록" }).click();
			const response = await createResponse;

			// Then: 201 Created 응답 확인
			expect(response.status()).toBe(201);

			// Then: 상세 페이지로 이동 확인
			await page.waitForURL(/\/timelines\/[^/]+$/, { timeout: 15000 });
			await page.waitForLoadState("networkidle");

			// Then: 등록한 정보 확인
			await expect(
				page.getByRole("heading", { name: TEST_NAME, exact: true }),
			).toBeVisible({ timeout: 10000 });

			// ── 수정 플로우 ──

			// When: 수정 버튼 클릭
			await page.getByRole("button", { name: "수정" }).click();
			await page.waitForURL(/\/timelines\/.*\/edit/, { timeout: 15000 });
			await page.waitForLoadState("networkidle");

			// Then: 수정 페이지 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "타임라인 수정" }),
			).toBeVisible({ timeout: 10000 });

			// When: 타임라인명 수정
			const nameInput = page.getByLabel("타임라인명");
			await nameInput.click();
			await nameInput.press("Meta+a");
			await nameInput.pressSequentially(UPDATED_NAME, { delay: 30 });
			await page.waitForTimeout(300);

			// When: 수정 버튼 클릭 (PATCH 응답 대기)
			const updateResponse = page.waitForResponse(
				(resp) =>
					resp.url().includes("/api/v1/timelines/") &&
					resp.request().method() === "PATCH",
			);
			await page.getByRole("button", { name: "수정" }).click();
			const patchResp = await updateResponse;

			// Then: 200 OK 응답 확인
			expect(patchResp.status()).toBe(200);

			// Then: 상세 페이지로 복귀
			await page.waitForURL(/\/timelines\/[^/]+$/, { timeout: 15000 });
			await page.waitForLoadState("networkidle");

			// 페이지 리로드하여 최신 데이터 확인
			await page.reload();
			await page.waitForLoadState("networkidle");

			await expect(
				page.getByRole("heading", { name: UPDATED_NAME, exact: true }),
			).toBeVisible({ timeout: 10000 });

			// ── 삭제 플로우 ──

			// When: 삭제 버튼 클릭 (상세 페이지의 삭제 버튼)
			await page.getByRole("button", { name: "삭제" }).click();

			// When: 삭제 확인 모달에서 삭제 버튼 클릭
			await page.waitForTimeout(500);

			const deleteResponse = page.waitForResponse(
				(resp) =>
					resp.url().includes("/api/v1/timelines/") &&
					resp.request().method() === "DELETE",
			);
			await page.getByRole("button", { name: "삭제" }).last().click();
			const deleteResp = await deleteResponse;

			// Then: 204 No Content 응답 확인
			expect(deleteResp.status()).toBe(204);

			// Then: 목록 페이지로 이동
			await page.waitForURL(/\/timelines\/?$/, { timeout: 15000 });
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

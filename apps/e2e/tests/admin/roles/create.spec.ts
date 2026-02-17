import { test, expect } from "@playwright/test";

test.describe("역할 등록 페이지", () => {
	// ── E2E-001: 역할 등록 플로우 ──

	test.describe("[E2E-001] 역할 등록 플로우", () => {
		test("역할 등록 → 상세 → 수정 → 삭제 전체 플로우", async ({ page }) => {
			// Cleanup: API를 직접 호출하여 기존 E2E_TEST_ROLE 삭제
			try {
				const rolesResp = await page.request.get(
					"http://localhost:3006/api/v1/roles",
				);
				const rolesBody = await rolesResp.json();
				const roles = rolesBody.data ?? rolesBody;
				const existing = (roles as { id: string; name: string }[]).find(
					(r) => r.name === "E2E_TEST_ROLE",
				);
				if (existing) {
					await page.request.delete(
						`http://localhost:3006/api/v1/roles/${existing.id}`,
					);
				}
			} catch {
				// cleanup 실패해도 계속 진행
			}

			// Given: 역할 등록 페이지로 이동
			await page.goto("./roles/new");
			await page.waitForLoadState("networkidle");

			// When: 폼 입력
			await page
				.getByRole("textbox", { name: /역할 식별자/ })
				.fill("E2E_TEST_ROLE");
			await page.getByRole("textbox", { name: "표시명" }).fill("E2E 테스트");

			// When: 역할 등록 버튼 클릭
			await page.getByRole("button", { name: "역할 등록" }).click();
			await page.waitForLoadState("networkidle");

			// Then: 등록 후 목록 페이지로 리다이렉트 확인
			await expect(
				page.getByRole("heading", { name: "역할 목록" }),
			).toBeVisible({ timeout: 10000 });

			// Then: 새로 등록된 역할이 목록에 표시됨
			await expect(
				page.getByText("E2E_TEST_ROLE", { exact: true }),
			).toBeVisible();

			// When: E2E_TEST_ROLE 행의 상세 버튼 클릭 (마지막 행)
			await page.getByRole("button", { name: "상세" }).last().click();
			await page.waitForLoadState("networkidle");

			// Then: 상세 페이지 확인
			await expect(
				page.getByRole("heading", { name: "역할 상세" }),
			).toBeVisible({ timeout: 10000 });
			await expect(page.getByText("E2E_TEST_ROLE")).toBeVisible();
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
				page.getByText("E2E_TEST_ROLE", { exact: true }),
			).not.toBeVisible();
		});
	});
});

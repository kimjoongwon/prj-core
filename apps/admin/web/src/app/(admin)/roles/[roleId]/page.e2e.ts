import { test, expect } from "@playwright/test";

test.describe("역할 상세 페이지", () => {
	// ── E2E-002: Grant 배치 할당 플로우 ──

	test.describe("[E2E-002] Grant 배치 할당 플로우", () => {
		test("역할 상세에 권한 목록 섹션이 표시되어야 한다", async ({ page }) => {
			// Given: 역할 목록에서 FULL_ACCESS 상세 버튼 클릭
			await page.goto("./roles");
			await page.waitForLoadState("networkidle");

			// When: FULL_ACCESS 행의 상세 버튼 클릭 (첫 번째)
			await page.getByRole("button", { name: "상세" }).first().click();
			await page.waitForLoadState("networkidle");

			// Then: 권한 목록 섹션 확인
			await expect(
				page.getByRole("heading", { name: "권한 목록" }),
			).toBeVisible();
		});

		test("권한 편집 버튼이 동작해야 한다", async ({ page }) => {
			// Given: 역할 상세 페이지
			await page.goto("./roles");
			await page.waitForLoadState("networkidle");
			await page.getByRole("button", { name: "상세" }).first().click();
			await page.waitForLoadState("networkidle");

			// Then: 권한 편집 버튼 확인
			await expect(
				page.getByRole("button", { name: "권한 편집" }),
			).toBeVisible();
		});
	});

	// ── E2E-004: 시스템 역할 보호 확인 ──

	test.describe("[E2E-004] 시스템 역할 보호", () => {
		test("시스템 역할(FULL_ACCESS) 상세에서 수정/삭제 버튼이 없어야 한다", async ({
			page,
		}) => {
			// Given: 역할 목록에서 FULL_ACCESS 상세 클릭
			await page.goto("./roles");
			await page.waitForLoadState("networkidle");
			await page.getByRole("button", { name: "상세" }).first().click();
			await page.waitForLoadState("networkidle");

			// Then: 시스템 역할 안내 문구 확인
			await expect(
				page.getByText(/시스템에서 기본 제공하는 역할/),
			).toBeVisible();

			// Then: 수정 버튼이 없음 (시스템 역할은 렌더링하지 않음)
			await expect(
				page.getByRole("button", { name: "수정" }),
			).not.toBeVisible();

			// Then: 삭제 버튼이 없음
			await expect(
				page.getByRole("button", { name: "삭제" }),
			).not.toBeVisible();
		});
	});
});

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

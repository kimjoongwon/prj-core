import { expect, type Page, test } from "@playwright/test";

function toAdminPath(href: string) {
	return href.startsWith("/admin") ? href : `/admin${href}`;
}

async function openPlatformAdminRoleDetail(page: Page) {
	await page.goto("./roles");
	await page.waitForLoadState("networkidle");

	const platformAdminRow = page
		.getByRole("row")
		.filter({ has: page.getByText("PLATFORM_ADMIN", { exact: true }) })
		.first();
	await expect(platformAdminRow).toBeVisible();
	const detailAction = platformAdminRow
		.getByRole("link", { name: "상세" })
		.or(platformAdminRow.getByRole("button", { name: "상세" }))
		.first();
	const href = await detailAction.getAttribute("href").catch(() => null);
	if (href) {
		await page.goto(toAdminPath(href), { waitUntil: "domcontentloaded" });
	} else {
		await detailAction.click();
	}
	await expect(page).toHaveURL(/\/admin\/roles\/[^/]+$/);
	await page.waitForLoadState("networkidle");
}

test.describe("역할 상세 페이지", () => {
	// ── E2E-002: Policy 할당 플로우 ──

	test.describe("[E2E-002] Policy 할당 플로우", () => {
		test("역할 상세에 기본 정보와 정책 할당 섹션이 표시되어야 한다", async ({
			page,
		}) => {
			// Given: 역할 목록에서 PLATFORM_ADMIN 상세 버튼 클릭
			await openPlatformAdminRoleDetail(page);

			await expect(
				page.getByRole("heading", { name: /역할 상세: 플랫폼 관리자/ }),
			).toBeVisible();
			await expect(
				page.getByRole("heading", { name: "기본 정보" }),
			).toBeVisible();
			await expect(
				page.getByText("PLATFORM_ADMIN", { exact: true }),
			).toBeVisible();
			await expect(
				page.getByRole("heading", { name: "정책 할당" }),
			).toBeVisible();
			await expect(
				page.getByText("현재 Space의 RoleAssignment를 관리합니다."),
			).toBeVisible();
		});

		test("정책 편집 버튼이 표시되어야 한다", async ({ page }) => {
			// Given: 역할 상세 페이지
			await openPlatformAdminRoleDetail(page);

			await expect(
				page.getByRole("button", { name: "정책 편집" }),
			).toBeVisible();
		});
	});

	// ── E2E-004: 시스템 역할 보호 확인 ──

	test.describe("[E2E-004] 시스템 역할 보호", () => {
		test("시스템 역할(PLATFORM_ADMIN) 상세에서 수정/삭제 버튼이 없어야 한다", async ({
			page,
		}) => {
			// Given: 역할 목록에서 PLATFORM_ADMIN 상세 클릭
			await openPlatformAdminRoleDetail(page);

			await expect(page.getByText("시스템 역할")).toBeVisible();
			await expect(page.getByText("예", { exact: true })).toBeVisible();

			// Then: 수정 버튼이 없음 (시스템 역할은 렌더링하지 않음)
			await expect(page.getByRole("button", { name: "수정" })).toHaveCount(0);

			// Then: 삭제 버튼이 없음
			await expect(page.getByRole("button", { name: "삭제" })).toHaveCount(0);
		});
	});
});

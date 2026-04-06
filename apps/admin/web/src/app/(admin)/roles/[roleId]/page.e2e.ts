import { expect, test, type Page } from "@playwright/test";

async function openFullAccessRoleDetail(page: Page) {
	await page.goto("./roles");
	await page.waitForLoadState("networkidle");

	const fullAccessRow = page
		.getByRole("row")
		.filter({ has: page.getByText("FULL_ACCESS", { exact: true }) })
		.first();
	await expect(fullAccessRow).toBeVisible();
	await fullAccessRow.getByRole("button", { name: "상세" }).click();
	await page.waitForLoadState("networkidle");
}

test.describe("역할 상세 페이지", () => {
	// ── E2E-002: Grant 배치 할당 플로우 ──

	test.describe("[E2E-002] Grant 배치 할당 플로우", () => {
		test("역할 상세에 메뉴/화면/데이터/고급 권한 섹션이 표시되어야 한다", async ({
			page,
		}) => {
			// Given: 역할 목록에서 FULL_ACCESS 상세 버튼 클릭
			await openFullAccessRoleDetail(page);

			// Then: 새 권한 섹션 확인
			await expect(
				page.getByRole("heading", { name: "메뉴 권한" }),
			).toBeVisible();
			await expect(
				page.getByRole("heading", { name: "화면 접근" }),
			).toBeVisible();
			await expect(
				page.getByRole("heading", { name: "데이터 권한" }),
			).toBeVisible();
			await expect(
				page.getByRole("heading", { name: "고급 권한 목록" }),
			).toBeVisible();
		});

		test("메뉴 편집 버튼이 표시되고 운영자용 권한 묶음이 보여야 한다", async ({
			page,
		}) => {
			// Given: 역할 상세 페이지
			await openFullAccessRoleDetail(page);

			// Then: 메뉴 편집 버튼과 권한 묶음 확인
			await expect(
				page.getByRole("button", { name: "메뉴 편집" }),
			).toBeVisible();
			await expect(
				page.getByText(/모든 메뉴, 화면, 데이터 권한이 자동 허용됩니다/, {
					exact: false,
				}),
			).toBeVisible();
			await expect(page.getByText("에셋 목록", { exact: true })).toBeVisible();
			await expect(
				page.getByText(/URL 직접 접근은 허용됩니다/, { exact: false }),
			).toBeVisible();
			await expect(page.getByText("회원 데이터", { exact: true })).toBeVisible();
		});
	});

	// ── E2E-004: 시스템 역할 보호 확인 ──

	test.describe("[E2E-004] 시스템 역할 보호", () => {
		test("시스템 역할(FULL_ACCESS) 상세에서 수정/삭제 버튼이 없어야 한다", async ({
			page,
		}) => {
			// Given: 역할 목록에서 FULL_ACCESS 상세 클릭
			await openFullAccessRoleDetail(page);

			// Then: 시스템 역할 안내 문구 확인
			await expect(
				page.getByText(/이름 변경과 삭제는 제한되지만, 메뉴 및 권한 배치는 조정할 수 있습니다/),
			).toBeVisible();

			// Then: 수정 버튼이 없음 (시스템 역할은 렌더링하지 않음)
			await expect(page.getByRole("button", { name: "수정" })).toHaveCount(0);

			// Then: 삭제 버튼이 없음
			await expect(page.getByRole("button", { name: "삭제" })).toHaveCount(0);
		});
	});
});

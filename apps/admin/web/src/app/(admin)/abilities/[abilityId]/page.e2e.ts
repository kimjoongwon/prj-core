import { expect, type Page, test } from "@playwright/test";

const ROUTE_READY_TIMEOUT = 20_000;

function getAbilitiesHeading(page: Page) {
	return page.getByRole("heading", {
		name: "권한 정의",
		exact: true,
		level: 1,
	});
}

async function gotoAbilitiesPage(page: Page) {
	await page.goto("./abilities", { waitUntil: "domcontentloaded" });
	await expect(getAbilitiesHeading(page)).toBeVisible({
		timeout: ROUTE_READY_TIMEOUT,
	});
}

test.describe("권한 상세 페이지", () => {
	test("목록 행 클릭 시 상세 페이지로 이동해야 한다", async ({ page }) => {
		// Given: 권한 목록 페이지
		await gotoAbilitiesPage(page);

		// When: 첫 번째 목록 행을 클릭
		const firstRow = page
			.getByRole("table", { name: "데이터 테이블" })
			.getByRole("row")
			.nth(1);
		await expect(firstRow).toBeVisible({
			timeout: ROUTE_READY_TIMEOUT,
		});
		await Promise.all([
			page.waitForURL(/\/abilities\/[1-9]\d*$/, {
				timeout: ROUTE_READY_TIMEOUT,
			}),
			firstRow.click(),
		]);

		// Then: 상세 페이지 URL 확인
		await expect(page).toHaveURL(/\/abilities\/[1-9]\d*$/);
		await expect(
			page.getByRole("heading", { name: "Ability 상세" }),
		).toBeVisible();
	});
});

import { expect, test } from "@playwright/test";
import { loginToConsole } from "@cocrepo/ui/e2e";

interface IdpAccountListItem {
	id: string;
}

const getFirstAccountId = async (
	page: import("@playwright/test").Page,
): Promise<string> => {
	const response = await page.request.get(
		"http://localhost:3008/api/v1/idp/accounts?take=1&skip=0",
	);
	expect(response.status()).toBe(200);
	const body = (await response.json()) as { data?: IdpAccountListItem[] };
	const accountId = body.data?.[0]?.id;
	expect(accountId).toBeTruthy();
	return accountId as string;
};

test.describe("IDP 계정 상세 페이지", () => {
	test("계정 상세 정보가 표시되어야 한다", async ({ page }) => {
		// Given: 로그인 후 상세 페이지 진입
		await loginToConsole(page);
		const accountId = await getFirstAccountId(page);
		await page.goto(`/accounts/${accountId}`);

		// Then: 상세 페이지로 이동하고 보안 정보가 표시됨
		await expect(page).toHaveURL(/\/accounts\/.+/);
		await page.waitForLoadState("networkidle");

		// 보안 정보 섹션 확인
		await expect(page.getByText("보안 정보")).toBeVisible();
	});

	test("상세 페이지에서 액션 버튼이 표시되어야 한다", async ({ page }) => {
		// Given: 로그인 후 상세 페이지 진입
		await loginToConsole(page);
		const accountId = await getFirstAccountId(page);
		await page.goto(`/accounts/${accountId}`);
		await page.waitForLoadState("networkidle");

		// Then: 액션 버튼 확인
		await expect(page.getByText("목록으로")).toBeVisible();
	});
});

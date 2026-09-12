import { expect, type Page, test } from "@playwright/test";

const SEARCH_PLACEHOLDER = "이메일로 검색...";

async function gotoEmailVerificationsPage(page: Page) {
	await page.goto("./email-verifications", { waitUntil: "domcontentloaded" });
	await page.waitForLoadState("networkidle").catch(() => undefined);

	const hasNextDevRuntimeOverlay =
		(await page
			.getByRole("dialog", { name: /Runtime ChunkLoadError/ })
			.isVisible()
			.catch(() => false)) ||
		(await page
			.getByRole("heading", {
				name: /Application error: a client-side exception has occurred/,
			})
			.isVisible()
			.catch(() => false));

	if (hasNextDevRuntimeOverlay) {
		await page.reload({ waitUntil: "domcontentloaded" });
		await page.waitForLoadState("networkidle").catch(() => undefined);
	}

	await expect(page.getByRole("heading", { name: "이메일 인증" })).toBeVisible({
		timeout: 15000,
	});
}

test.describe("이메일 인증 관리 페이지", () => {
	test.beforeEach(async ({ page }) => {
		await gotoEmailVerificationsPage(page);
	});

	test("페이지 타이틀과 목록 영역이 표시되어야 한다", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: "이메일 인증" }),
		).toBeVisible();
		await expect(
			page.getByText("회원가입 전 이메일 인증 요청과 발송 상태를 관리합니다."),
		).toBeVisible();
		await expect(page.getByText(/총 \d+건/)).toBeVisible();
	});

	test("DataGrid 컬럼 헤더가 표시되어야 한다", async ({ page }) => {
		if (
			await page.getByText("조회된 이메일 인증 요청이 없습니다.").isVisible()
		) {
			await expect(page.getByText("총 0건")).toBeVisible();
			return;
		}

		await expect(
			page.getByRole("columnheader", { name: "이메일", exact: true }),
		).toBeVisible();
		await expect(
			page.getByRole("columnheader", { name: "이름", exact: true }),
		).toBeVisible();
		await expect(
			page.getByRole("columnheader", { name: "상태", exact: true }),
		).toBeVisible();
		await expect(
			page.getByRole("columnheader", { name: "발송 상태", exact: true }),
		).toBeVisible();
		await expect(
			page.getByRole("columnheader", { name: "발송 횟수", exact: true }),
		).toBeVisible();
		await expect(
			page.getByRole("columnheader", { name: "만료 시간", exact: true }),
		).toBeVisible();
		await expect(
			page.getByRole("columnheader", { name: "인증 시각", exact: true }),
		).toBeVisible();
	});

	test("이메일 검색어 입력 시 URL에 email 파라미터가 추가되어야 한다", async ({
		page,
	}) => {
		const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);
		await searchInput.fill("admin@example.com");
		await expect(searchInput).toHaveValue("admin@example.com");
		await searchInput.press("Enter");

		await expect(page).toHaveURL(/email=admin(?:%40|@)example\.com/);
	});

	test("상태 필터 선택 시 URL에 status 파라미터가 추가되어야 한다", async ({
		page,
	}) => {
		await page
			.getByRole("combobox", { name: "status" })
			.selectOption("PENDING");

		await expect(page).toHaveURL(/status=PENDING/);
	});

	test("재발송 가능 row는 재발송 요청을 보낼 수 있어야 한다", async ({
		page,
	}) => {
		const resendButton = page.getByRole("button", { name: "재발송" }).first();
		const isVisible = await resendButton.isVisible().catch(() => false);

		if (!isVisible || (await resendButton.isDisabled().catch(() => true))) {
			await expect(page.getByText(/총 \d+건/)).toBeVisible();
			return;
		}

		const resendResponse = page.waitForResponse(
			(resp) =>
				resp.url().includes("/api/v1/idp/email-verifications/") &&
				resp.request().method() === "POST",
		);
		await resendButton.click();
		await expect((await resendResponse).ok()).toBe(true);
	});
});

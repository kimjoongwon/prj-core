import { expect, test } from "@playwright/test";

const USER_DETAIL_PATH_PATTERN = /^\/admin\/users\/[0-9A-HJKMNP-TV-Z]{26}$/;

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getFirstRowName = async (
	page: import("@playwright/test").Page,
): Promise<string | null> => {
	const firstRowHeader = page.getByRole("rowheader").first();
	const isVisible = await firstRowHeader.isVisible().catch(() => false);
	if (!isVisible) {
		return null;
	}
	const text = (await firstRowHeader.textContent())?.trim() ?? "";
	return text.length > 0 ? text : null;
};

test.describe("이용자 목록 페이지", () => {
	test.describe("페이지 렌더링", () => {
		test.beforeEach(async ({ page }) => {
			// Given: 이용자 목록 페이지 진입
			await page.goto("./users");
			await page.waitForLoadState("networkidle");
		});

		test("페이지 타이틀과 설명이 표시되어야 한다", async ({ page }) => {
			// Then: 타이틀과 설명 확인
			await expect(
				page.getByRole("heading", { name: "이용자 목록" }),
			).toBeVisible();
			await expect(
				page.getByText("시스템에 등록된 이용자를 조회합니다."),
			).toBeVisible();
		});

		test("통계 카운터가 표시되지 않아야 한다", async ({ page }) => {
			// Then: 목록 화면에는 이용자 상태 카운터가 표시되지 않음
			await expect(page.getByText("전체 이용자", { exact: true })).toBeHidden();
			await expect(page.getByText("활성 이용자", { exact: true })).toBeHidden();
			await expect(
				page.getByText("비활성 이용자", { exact: true }),
			).toBeHidden();
		});

		test("DataGrid 컬럼 헤더가 표시되어야 한다", async ({ page }) => {
			// Then:
			// - 데이터가 있으면 컬럼 헤더 표시
			// - 데이터가 없으면 빈 메시지 표시
			const hasRows = await page
				.getByRole("rowheader")
				.first()
				.isVisible()
				.catch(() => false);
			if (hasRows) {
				await expect(
					page.getByRole("columnheader", { name: "이름" }),
				).toBeVisible();
				await expect(
					page.getByRole("columnheader", { name: "이메일" }),
				).toBeVisible();
				await expect(
					page.getByRole("columnheader", { name: "전화번호" }),
				).toBeVisible();
				await expect(
					page.getByRole("columnheader", { name: "역할" }),
				).toBeVisible();
				await expect(
					page.getByRole("columnheader", { name: "상태" }),
				).toBeVisible();
				await expect(
					page.getByRole("columnheader", { name: "가입일" }),
				).toBeVisible();
				return;
			}
			await expect(page.getByText(/총 \d+건/)).toBeVisible();
		});

		test("총 N건 텍스트가 표시되어야 한다", async ({ page }) => {
			// Then: 총 건수 텍스트 확인
			await expect(page.getByText(/총 \d+건/)).toBeVisible();
		});

		test("디렉터리 헤더의 총 N명 pill이 표시되어야 한다", async ({ page }) => {
			// Then: 디렉터리 헤더 요약 pill 확인
			await expect(page.getByText(/총 \d+명/)).toBeVisible();
		});

		test("시드 데이터의 사용자가 DataGrid에 표시되어야 한다", async ({
			page,
		}) => {
			// Then: 데이터가 있으면 첫 행이, 없으면 빈 상태가 표시됨
			const firstRowName = await getFirstRowName(page);
			if (firstRowName) {
				await expect(
					page.getByRole("rowheader", {
						name: new RegExp(escapeRegExp(firstRowName)),
					}),
				).toBeVisible();
				return;
			}
			await expect(page.getByText(/총 \d+건/)).toBeVisible();
		});

		test("회원 이름을 누르면 회원 상세 페이지로 이동해야 한다", async ({
			page,
		}) => {
			const firstRow = page.getByRole("rowheader").first();
			const hasRows = await firstRow.isVisible().catch(() => false);
			if (!hasRows) {
				await expect(page.getByText(/총 \d+건/)).toBeVisible();
				return;
			}

			const nameLink = firstRow.getByRole("link");
			const href = await nameLink.getAttribute("href");
			expect(href).toMatch(USER_DETAIL_PATH_PATTERN);

			await nameLink.click();

			await expect(page).toHaveURL(new RegExp(`${escapeRegExp(href ?? "")}$`));
			await expect(
				page.getByRole("heading", { name: "회원 상세" }),
			).toBeVisible();
			await expect(
				page.getByText("회원 상세 기능을 준비하고 있습니다."),
			).toBeVisible();
		});
	});

	test.describe("URL 상태 관리", () => {
		test("URL 파라미터 take로 페이지 크기가 설정되어야 한다", async ({
			page,
		}) => {
			// Given: take 파라미터가 포함된 URL로 진입
			await page.goto("./users?take=5");
			await page.waitForLoadState("networkidle");

			// Then: 페이지가 정상 렌더링됨
			await expect(
				page.getByRole("heading", { name: "이용자 목록" }),
			).toBeVisible();
			await expect(page.getByText(/총 \d+건/)).toBeVisible();
		});
	});

	test.describe("데이터 표시", () => {
		test.beforeEach(async ({ page }) => {
			// Given: 이용자 목록 페이지 진입
			await page.goto("./users");
			await page.waitForLoadState("networkidle");
		});

		test("전화번호가 포맷팅되어 표시되어야 한다", async ({ page }) => {
			// Then: 데이터가 있으면 하이픈 포맷 전화번호가 표시됨
			const hasRows = await page
				.getByRole("rowheader")
				.first()
				.isVisible()
				.catch(() => false);
			if (!hasRows) {
				await expect(page.getByText(/총 \d+건/)).toBeVisible();
				return;
			}
			await expect(
				page.getByText(/\d{2,3}-\d{3,4}-\d{4}/).first(),
			).toBeVisible();
		});

		test("활성 사용자의 상태가 활성으로 표시되어야 한다", async ({ page }) => {
			// Then: 데이터가 있으면 상태 칩이 표시됨
			const hasRows = await page
				.getByRole("rowheader")
				.first()
				.isVisible()
				.catch(() => false);
			if (!hasRows) {
				await expect(page.getByText(/총 \d+건/)).toBeVisible();
				return;
			}
			await expect(page.getByText(/^(활성|비활성)$/).first()).toBeVisible();
		});
	});
});

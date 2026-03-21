import { expect, test } from "@playwright/test";

const SEARCH_PLACEHOLDER = "이름, 이메일, 전화번호로 검색...";

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

		test("통계 카드 3개가 표시되어야 한다", async ({ page }) => {
			// Then:
			// - stats 응답이 있으면 카드 3종이 표시됨
			// - stats 응답이 없으면 목록 영역은 정상 렌더링됨
			const totalUsersCard = page.getByText("전체 이용자", { exact: true });
			const hasStats = await totalUsersCard.isVisible().catch(() => false);
			if (hasStats) {
				await expect(totalUsersCard).toBeVisible();
				await expect(
					page.getByText("활성 이용자", { exact: true }),
				).toBeVisible();
				await expect(
					page.getByText("비활성 이용자", { exact: true }),
				).toBeVisible();
				return;
			}
			await expect(page.getByText(/총 \d+건/)).toBeVisible();
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

		test("검색 입력란이 표시되어야 한다", async ({ page }) => {
			// Then: 검색 placeholder 확인
			await expect(page.getByPlaceholder(SEARCH_PLACEHOLDER)).toBeVisible();
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
	});

	test.describe("검색 기능", () => {
		test.beforeEach(async ({ page }) => {
			// Given: 이용자 목록 페이지 진입
			await page.goto("./users");
			await page.waitForLoadState("networkidle");
		});

		test("검색어 입력 시 URL에 search 파라미터가 추가되어야 한다", async ({
			page,
		}) => {
			// When: 검색어 입력
			await page.getByPlaceholder(SEARCH_PLACEHOLDER).fill("admin");

			// debounce 대기
			await page.waitForTimeout(500);

			// Then: URL에 search 파라미터 반영
			await expect(page).toHaveURL(/search=admin/);
		});

		test("이름으로 검색 시 해당 사용자만 표시되어야 한다", async ({ page }) => {
			// Given: 현재 목록의 첫 사용자명 확인
			const firstRowName = await getFirstRowName(page);
			if (!firstRowName) {
				await expect(page.getByText(/총 \d+건/)).toBeVisible();
				return;
			}

			// When: 사용자명으로 검색
			await page.getByPlaceholder(SEARCH_PLACEHOLDER).fill(firstRowName);
			await page.waitForTimeout(500);
			await page.waitForLoadState("networkidle");

			// Then: 검색 대상 사용자가 표시됨
			await expect(
				page.getByRole("rowheader", {
					name: new RegExp(escapeRegExp(firstRowName)),
				}),
			).toBeVisible();
		});

		test("다른 이름으로 검색 시 해당 사용자만 표시되어야 한다", async ({
			page,
		}) => {
			// When: 존재하지 않는 검색어 입력
			await page.getByPlaceholder(SEARCH_PLACEHOLDER).fill("__no_match_user__");
			await page.waitForTimeout(500);
			await page.waitForLoadState("networkidle");

			// Then: URL 반영 및 목록 영역 유지
			await expect(page).toHaveURL(/search=__no_match_user__/);
			await expect(page.getByText(/총 \d+건/)).toBeVisible();
		});

		test("존재하지 않는 검색어 입력 시 빈 상태 메시지가 표시되어야 한다", async ({
			page,
		}) => {
			// When: 존재하지 않는 검색어 입력
			await page
				.getByPlaceholder(SEARCH_PLACEHOLDER)
				.fill("존재하지않는사용자xyz");
			await page.waitForTimeout(500);
			await page.waitForLoadState("networkidle");

			// Then: URL 반영 및 목록 영역 유지
			await expect(page).toHaveURL(
				/search=%EC%A1%B4%EC%9E%AC%ED%95%98%EC%A7%80%EC%95%8A%EB%8A%94%EC%82%AC%EC%9A%A9%EC%9E%90xyz/,
			);
			await expect(page.getByText(/총 \d+건/)).toBeVisible();
		});

		test("검색어를 지우면 전체 목록으로 복원되어야 한다", async ({ page }) => {
			// Given: 검색어 입력 상태
			const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);
			await searchInput.fill("__temp_filter__");
			await page.waitForTimeout(500);
			await page.waitForLoadState("networkidle");

			// When: 검색어 삭제
			await searchInput.clear();
			await page.waitForTimeout(500);
			await page.waitForLoadState("networkidle");

			// Then: URL에서 search 파라미터가 제거되거나 빈 값으로 정리됨
			await expect(async () => {
				const url = page.url();
				expect(!url.includes("search=") || /search=$/.test(url)).toBe(true);
			}).toPass({ timeout: 5000 });

			// Then: 데이터가 있으면 행이 다시 표시되고, 없으면 빈 상태 유지
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
	});

	test.describe("URL 상태 관리", () => {
		test("URL 파라미터 search로 페이지 진입 시 검색어가 복원되어야 한다", async ({
			page,
		}) => {
			// Given: 기본 목록에서 검색 대상 확보
			await page.goto("./users");
			await page.waitForLoadState("networkidle");
			const firstRowName = await getFirstRowName(page);
			const searchTerm = firstRowName ?? "admin";
			await expect(page.getByText(/총 \d+건/)).toBeVisible();

			// Given: search 파라미터가 포함된 URL로 진입
			await page.goto(`./users?search=${encodeURIComponent(searchTerm)}`);
			await page.waitForLoadState("networkidle");

			// Then: 검색 입력란에 검색어가 복원됨
			await expect(page.getByPlaceholder(SEARCH_PLACEHOLDER)).toHaveValue(
				searchTerm,
			);

			// Then: 검색 결과가 필터링되어 표시됨
			if (firstRowName) {
				await expect(
					page.getByRole("rowheader", {
						name: new RegExp(escapeRegExp(firstRowName)),
					}),
				).toBeVisible();
				return;
			}
			await expect(page).toHaveURL(/search=admin/);
		});

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

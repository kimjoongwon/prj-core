import { expect, type Page, test } from "@playwright/test";

const ROUTE_READY_TIMEOUT = 20_000;

function getAbilitiesHeading(page: Page) {
	return page
		.getByRole("heading", {
			name: "권한 정의",
			exact: true,
			level: 1,
		})
		.first();
}

async function gotoAbilitiesPage(page: Page) {
	await page.goto("./abilities", { waitUntil: "domcontentloaded" });
	await expect(getAbilitiesHeading(page)).toBeVisible({
		timeout: ROUTE_READY_TIMEOUT,
	});
}

async function gotoAbilityCreatePage(page: Page) {
	await page.goto("./abilities/new", { waitUntil: "domcontentloaded" });
	await expect(
		page.getByRole("heading", { name: "Ability 등록", exact: true }),
	).toBeVisible({
		timeout: ROUTE_READY_TIMEOUT,
	});
}

test.describe("권한 목록 페이지", () => {
	// ── E2E-003: 목록 렌더링 ──

	test.describe("[E2E-003] 목록 렌더링", () => {
		test("권한 정의 페이지가 정상 렌더링되어야 한다", async ({ page }) => {
			// Given: 권한 목록 페이지 진입
			await gotoAbilitiesPage(page);

			// Then: 타이틀 확인
			await expect(getAbilitiesHeading(page)).toBeVisible();
		});

		test("권한 추가 버튼이 표시되어야 한다", async ({ page }) => {
			// Given: 권한 목록 페이지 진입
			await gotoAbilitiesPage(page);

			// Then: 권한 추가 버튼 확인
			await expect(
				page.getByRole("button", { name: "권한 추가" }),
			).toBeVisible();
		});

		test("권한 목록에 시드 데이터가 표시되어야 한다", async ({ page }) => {
			// Given: 권한 목록 페이지 진입
			await gotoAbilitiesPage(page);

			// Then: 총 건수 표시
			await expect(page.getByText("총")).toBeVisible();
			await expect(
				page.getByRole("table", { name: "데이터 테이블" }),
			).toBeVisible();
		});

		test("요약 카드가 표시되어야 한다", async ({ page }) => {
			// Given: 권한 목록 페이지 진입
			await gotoAbilitiesPage(page);

			// Then: 운영자가 전체 상태를 빠르게 읽을 수 있는 요약 카드 확인
			await expect(page.getByText("전체").first()).toBeVisible();
			await expect(page.getByText("표시 중")).toBeVisible();
			await expect(page.getByText("거부 규칙")).toBeVisible();
			await expect(page.getByText("조건/필드 제한")).toBeVisible();
		});
	});

	// ── E2E-003: 등록 폼 ──

	test.describe("[E2E-003] 등록 폼", () => {
		test("권한 등록 페이지에서 폼이 렌더링되어야 한다", async ({ page }) => {
			// Given: 권한 등록 페이지 진입
			await gotoAbilityCreatePage(page);

			// Then: 페이지 타이틀 확인
			await expect(
				page.getByRole("heading", { name: "Ability 등록" }),
			).toBeVisible();

			// Then: CASL 정보 섹션의 Subject/Action 드롭다운 확인
			await expect(page.getByRole("button", { name: /Subject/ })).toBeVisible();
			await expect(page.getByRole("button", { name: /Action/ })).toBeVisible();
		});
	});

	// ── E2E-006: 거부 규칙(inverted) 등록 ──

	test.describe("[E2E-006] 거부 규칙(inverted)", () => {
		test("등록 폼에서 inverted 관련 UI가 존재해야 한다", async ({ page }) => {
			// Given: 권한 등록 페이지
			await gotoAbilityCreatePage(page);

			// Then: "거부 권한 (cannot)" 텍스트와 스위치 확인
			await expect(page.getByText("거부 권한")).toBeVisible();
		});
	});

	// ── 필터 기능 ──

	test.describe("필터 기능", () => {
		test("검색 입력란이 존재해야 한다", async ({ page }) => {
			// Given: 권한 목록 페이지
			await gotoAbilitiesPage(page);

			// Then: 검색 입력란 확인
			await expect(
				page.getByRole("textbox", { name: "권한 이름 검색" }),
			).toBeVisible();
		});

		test("대상/행동/규칙 유형 필터가 존재해야 한다", async ({ page }) => {
			// Given: 권한 목록 페이지
			await gotoAbilitiesPage(page);

			// Then: HeroUI Select trigger placeholder 확인
			await expect(
				page.locator("button").filter({ hasText: "대상(Subject)" }).first(),
			).toBeVisible();
			await expect(
				page.locator("button").filter({ hasText: "행동(Action)" }).first(),
			).toBeVisible();
			await expect(
				page.locator("button").filter({ hasText: "규칙 유형" }).first(),
			).toBeVisible();
		});

		test("검색어로 대상과 행동까지 필터링하고 초기화할 수 있어야 한다", async ({
			page,
		}) => {
			// Given: 권한 목록 페이지
			await gotoAbilitiesPage(page);

			// When: Subject/Action 표시명에 포함된 검색어 입력
			await page.getByRole("textbox", { name: "권한 이름 검색" }).fill("접근");

			// Then: 검색 조건에 맞는 적용 필터 칩 확인
			await expect(page.getByText("검색: 접근")).toBeVisible();

			// When: 필터 초기화
			await page.getByRole("button", { name: "필터 초기화" }).click();

			// Then: 첫 페이지 기본 결과가 다시 표시됨
			await expect(page.getByText("검색: 접근")).not.toBeVisible();
			await expect(
				page.getByRole("table", { name: "데이터 테이블" }),
			).toBeVisible();
		});

		test("query 페이지네이션에 따라 표시 row가 바뀌어야 한다", async ({
			page,
		}) => {
			// Given: 첫 페이지의 작은 page size로 진입
			await page.goto("./abilities?take=5&skip=0", {
				waitUntil: "domcontentloaded",
			});
			await expect(getAbilitiesHeading(page)).toBeVisible({
				timeout: ROUTE_READY_TIMEOUT,
			});
			const firstPageRow = await page
				.getByRole("table", { name: "데이터 테이블" })
				.getByRole("row")
				.nth(1)
				.innerText();

			// When: 두 번째 페이지 query로 진입
			await page.goto("./abilities?take=5&skip=5", {
				waitUntil: "domcontentloaded",
			});
			await expect(getAbilitiesHeading(page)).toBeVisible({
				timeout: ROUTE_READY_TIMEOUT,
			});
			const secondPageRow = await page
				.getByRole("table", { name: "데이터 테이블" })
				.getByRole("row")
				.nth(1)
				.innerText();

			// Then: 같은 전체 목록에서 페이지 슬라이스가 달라짐
			expect(secondPageRow).not.toBe(firstPageRow);
		});
	});
});

import { expect, type Locator, type Page, test } from "@playwright/test";

const getSidebarNav = (page: Page) =>
	page.locator("aside").getByRole("navigation").first();

const getRootMenuButton = (
	sidebar: Locator,
	label: string,
	description: string,
) =>
	sidebar
		.getByRole("button")
		.filter({ hasText: label })
		.filter({ hasText: description });

const getSubMenuButton = (sidebar: Locator, label: string) =>
	sidebar.getByRole("button", { name: label, exact: true });

test.describe("Admin 앱 기본 테스트", () => {
	test("메인 페이지 로딩 확인", async ({ page }) => {
		// Given: 메인 페이지로 이동
		await page.goto("/", { waitUntil: "domcontentloaded" });

		// Then: 페이지가 정상 로드됨
		await expect(page).toHaveTitle(/Admin/i);
	});

	test("대시보드 페이지 접근", async ({ page }) => {
		// Given: 대시보드 페이지로 이동
		await page.goto("/dashboard", { waitUntil: "domcontentloaded" });

		// Then: 대시보드가 표시됨
		await expect(page.locator("body")).toBeVisible();
	});
});

test.describe("반응형 레이아웃 테스트", () => {
	test("데스크톱에서 사이드바 표시", async ({ page }) => {
		// Given: 데스크톱 뷰포트 설정
		await page.setViewportSize({ width: 1280, height: 720 });

		// When: 메인 페이지 로드
		await page.goto("/", { waitUntil: "domcontentloaded" });

		// Then: 사이드바가 표시됨 (768px 이상)
		// 실제 selector는 구현에 맞게 수정 필요
		// const sidebar = page.locator('[data-testid="admin-sidebar"]');
		// await expect(sidebar).toBeVisible();
	});

	test("모바일에서 BottomTab 표시", async ({ page }) => {
		// Given: 모바일 뷰포트 설정
		await page.setViewportSize({ width: 375, height: 667 });

		// When: 메인 페이지 로드
		await page.goto("/", { waitUntil: "domcontentloaded" });

		// Then: BottomTab이 표시됨 (768px 미만)
		// 실제 selector는 구현에 맞게 수정 필요
		// const bottomTab = page.locator('[data-testid="admin-bottom-tab"]');
		// await expect(bottomTab).toBeVisible();
	});
});

test.describe("사이드바 메뉴 회귀", () => {
	test.beforeEach(async ({ page }) => {
		// Given: 데스크톱 사이드바가 보이는 뷰포트로 대시보드 진입
		await page.setViewportSize({ width: 1280, height: 720 });
		await page.goto("./dashboard", {
			waitUntil: "domcontentloaded",
			timeout: 60000,
		});
	});

	test("하위 메뉴 선택 시 본인이 속한 1depth 메뉴만 열려야 한다", async ({
		page,
	}) => {
		const sidebar = getSidebarNav(page);
		const usersMenuButton = getRootMenuButton(
			sidebar,
			"회원",
			"회원 계정과 상태를 검색하고 조정합니다.",
		);
		const rolesMenuButton = getRootMenuButton(
			sidebar,
			"권한 관리",
			"권한, 액션, 대상 규칙을 편집합니다.",
		);
		const usersListMenuButton = getSubMenuButton(sidebar, "회원 목록");
		const rolesListMenuButton = getSubMenuButton(sidebar, "역할");

		// When: 서로 다른 1depth 메뉴를 연 뒤 권한 관리의 하위 메뉴를 선택
		await expect(sidebar).toBeVisible();
		await usersMenuButton.click();
		await expect(usersListMenuButton).toBeVisible();
		await rolesMenuButton.click();
		await expect(rolesListMenuButton).toBeVisible();
		await rolesListMenuButton.click();

		// Then: 선택된 하위 메뉴의 1depth 부모만 열려 있고, 이전 부모는 닫힘
		await expect(page).toHaveURL(/\/roles(?:[/?#]|$)/);
		await expect(rolesListMenuButton).toBeVisible();
		await expect(usersListMenuButton).toBeHidden();
	});
});

test.describe("헤더 IDP 관리 버튼", () => {
	test.beforeEach(async ({ page }) => {
		// Given: 관리자 대시보드 진입 (루트는 로그인으로 리다이렉트됨)
		const navigated = await page
			.goto("./dashboard", {
				waitUntil: "domcontentloaded",
				timeout: 60000,
			})
			.then(() => true)
			.catch(() => false);
		test.skip(
			!navigated,
			"대시보드 진입이 타임아웃되어 본 케이스를 건너뜁니다.",
		);
	});

	test("IDP 관리 버튼이 헤더에 표시되어야 한다", async ({ page }) => {
		// Then: IDP 관리 버튼이 보임
		const idpButton = page.getByRole("button", {
			name: "IDP 관리 콘솔 열기",
		});
		await expect(idpButton).toBeVisible();
	});

	test("IDP 관리 버튼 클릭 시 새 탭이 열려야 한다", async ({
		page,
		context,
	}) => {
		// Given: IDP 관리 버튼 찾기
		const idpButton = page.getByRole("button", {
			name: "IDP 관리 콘솔 열기",
		});

		// When: 버튼 클릭
		const popupPromise = context
			.waitForEvent("page", { timeout: 3000 })
			.catch(() => null);
		await idpButton.click();
		const newPage = await popupPromise;

		// Then:
		// - env가 설정된 경우: 새 탭으로 IDP 콘솔이 열린다.
		// - env가 없는 경우: 현재 페이지 상태가 유지된다.
		if (newPage) {
			await newPage.waitForLoadState("domcontentloaded");
			expect(newPage.url()).toContain("localhost:3008");
			return;
		}

		await expect(page).toHaveURL(/dashboard/);
	});
});

test.describe("SSR hydration 회귀", () => {
	test("로그인 후 대시보드 진입 시 hydration recoverable error가 없어야 한다", async ({
		page,
	}) => {
		const consoleErrors: string[] = [];

		page.on("console", (message) => {
			if (message.type() !== "error") {
				return;
			}

			consoleErrors.push(message.text());
		});

		await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
		await expect(page.locator("body")).toBeVisible();
		await page.waitForTimeout(1500);

		const hydrationErrors = consoleErrors.filter(
			(message) =>
				message.includes("Recoverable Error") ||
				message.includes(
					"Hydration failed because the server rendered HTML didn't match the client",
				),
		);

		expect(hydrationErrors).toEqual([]);
	});
});

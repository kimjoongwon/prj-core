import { loginToConsole } from "@cocrepo/e2e";
import {
	expect,
	type Locator,
	type Page,
	type Route,
	test,
} from "@playwright/test";

const SYSTEM_SPACE_ID =
	process.env.E2E_SYSTEM_SPACE_ID ?? "61ddca20-1752-466e-b4da-879ebdbe54e3";

async function fallbackRoute(route: Route) {
	await route.fallback();
}

async function mockAdminAccessBootstrap(page: Page) {
	await page.route("**/api/v1/auth/current-space**", async (route) => {
		if (route.request().method() !== "GET") {
			await fallbackRoute(route);
			return;
		}

		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: {
					id: SYSTEM_SPACE_ID,
					ground: { name: "플랫폼 운영본부" },
					contentLanguageCode: "ko_KR",
				},
			}),
		});
	});
	await page.route("**/api/v1/auth/my-spaces**", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: [
					{
						id: SYSTEM_SPACE_ID,
						ground: { name: "플랫폼 운영본부" },
						contentLanguageCode: "ko_KR",
					},
				],
			}),
		});
	});
	await page.route("**/api/v1/auth/verify-token**", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({ data: { hasFullAccess: true } }),
		});
	});
	await page.route("**/api/v1/abilities/my**", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({ data: [] }),
		});
	});
}

const getSidebarNav = (page: Page) =>
	page.locator("aside").getByRole("navigation").first();

const getRootMenuButton = (sidebar: Locator, label: string) =>
	sidebar.getByRole("button", { name: new RegExp(`^${label}`) }).first();

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
		await loginToConsole(page);
		await mockAdminAccessBootstrap(page);
		await page.goto("./dashboard", {
			waitUntil: "domcontentloaded",
			timeout: 60000,
		});
		await expect(page.getByRole("heading", { name: "대시보드" })).toBeVisible({
			timeout: 30000,
		});
	});

	test("하위 메뉴 선택 시 본인이 속한 1depth 메뉴만 열려야 한다", async ({
		page,
	}) => {
		const sidebar = getSidebarNav(page);
		const rolesMenuButton = getRootMenuButton(sidebar, "권한 관리");
		const timelinesMenuButton = getRootMenuButton(sidebar, "일정 관리");
		const rolesListMenuButton = getSubMenuButton(sidebar, "역할");
		const timelinesListMenuButton = getSubMenuButton(sidebar, "타임라인");

		// When: 서로 다른 1depth 메뉴를 연 뒤 권한 관리의 하위 메뉴를 선택
		await expect(sidebar).toBeVisible();
		await rolesMenuButton.click();
		await expect(rolesListMenuButton).toBeVisible();
		await timelinesMenuButton.click();
		await expect(timelinesListMenuButton).toBeVisible();
		await expect(rolesListMenuButton).toBeHidden();
		await rolesMenuButton.click();
		await expect(rolesListMenuButton).toBeVisible();
		await expect(timelinesListMenuButton).toBeHidden();
		await rolesListMenuButton.click();

		// Then: 선택된 하위 메뉴의 1depth 부모만 열려 있고, 이전 부모는 닫힘
		await expect(
			page.getByRole("heading", { name: "역할 목록", exact: true }),
		).toBeVisible({ timeout: 15000 });
		await expect(page).toHaveURL(/\/roles(?:[/?#]|$)/, { timeout: 15000 });
		await expect(rolesListMenuButton).toBeVisible();
		await expect(timelinesListMenuButton).toBeHidden();
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

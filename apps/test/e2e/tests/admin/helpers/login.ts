import {
	type AdminPersistSpaceSelection,
	mergeAdminPersistAccountSelection,
	parseAdminPersistStorageDocument,
	runOidcLoginFlow,
} from "@cocrepo/e2e";
import type { Page } from "@playwright/test";

const ADMIN_DASHBOARD_PATH = "/admin/dashboard";
const ADMIN_LOGIN_PATH = "/admin/auth/login";
const ADMIN_LOGIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "admin@plate.com";
const ADMIN_LOGIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "rkdmf12!@";
const ADMIN_PERSIST_KEY = "admin-persist";
const ADMIN_PERSIST_READY_TIMEOUT = 15_000;
const ROUTE_PREWARM_TIMEOUT = 10_000;
const ADMIN_ORIGIN =
	process.env.E2E_ADMIN_BASE_URL ?? "http://localhost:3000/admin/";

const ADMIN_PREWARM_PATHS = [
	ADMIN_DASHBOARD_PATH,
	"/admin/actions",
	"/admin/abilities",
	"/admin/assets",
	"/admin/templates",
	"/admin/tasks",
	"/admin/routines",
	"/admin/inquiries",
	"/admin/subjects",
	"/admin/spaces",
	"/admin/roles",
	"/admin/timelines",
	"/admin/users",
];

async function ensureAdminDashboard(page: Page) {
	if (page.url().includes("/admin/")) {
		return;
	}

	await page.goto(ADMIN_DASHBOARD_PATH, {
		waitUntil: "domcontentloaded",
		timeout: ROUTE_PREWARM_TIMEOUT,
	});
}

/**
 * Admin localStorage에서 부트스트랩이 확정한 tenant/space 선택값을 읽습니다.
 *
 * @param page Admin E2E page
 * @returns persist 문서의 account 선택값, 아직 확정되지 않았으면 null
 */
export async function readAdminPersistRawSelection(
	page: Page,
): Promise<AdminPersistSpaceSelection | null> {
	const selection = await page.evaluate((storageKey) => {
		const raw = window.localStorage.getItem(storageKey);
		if (!raw) {
			return null;
		}

		try {
			const parsed = JSON.parse(raw) as {
				account?: {
					tenantId?: unknown;
					spaceId?: unknown;
					fitnessCenterName?: unknown;
					contentLanguageCode?: unknown;
				};
			};
			const account = parsed.account;
			if (
				typeof account?.tenantId === "string" &&
				typeof account.spaceId === "string" &&
				typeof account.fitnessCenterName === "string"
			) {
				return {
					tenantId: account.tenantId,
					spaceId: account.spaceId,
					fitnessCenterName: account.fitnessCenterName,
					contentLanguageCode:
						typeof account.contentLanguageCode === "string"
							? account.contentLanguageCode
							: null,
				};
			}
		} catch {
			return null;
		}

		return null;
	}, ADMIN_PERSIST_KEY);

	return selection;
}

/**
 * Admin localStorage의 account section을 선택한 FitnessCenter context로 갱신합니다.
 *
 * @param page Admin E2E page
 * @param nextSpace 저장할 tenant/space/FitnessCenter 선택
 */
export async function seedAdminPersist(
	page: Page,
	nextSpace: AdminPersistSpaceSelection,
) {
	await ensureAdminDashboard(page);
	const raw = await readAdminPersistRaw(page);
	const document = mergeAdminPersistAccountSelection(raw, nextSpace);

	await page.evaluate(
		({ storageKey, value }) => {
			window.localStorage.setItem(storageKey, value);
		},
		{
			storageKey: ADMIN_PERSIST_KEY,
			value: JSON.stringify(document),
		},
	);
}

/**
 * Admin localStorage에서 부트스트랩 결과와 일치하는 persist 문서를 읽습니다.
 *
 * @param page Admin E2E page
 * @param expectedSelection 로그인 bootstrap에서 얻은 tenant/space 선택값
 * @returns 검증된 persist 문서, 없으면 null
 */
export async function readAdminPersist(
	page: Page,
	expectedSelection: AdminPersistSpaceSelection,
) {
	await ensureAdminDashboard(page);
	await page.waitForFunction(
		(storageKey) => {
			const raw = window.localStorage.getItem(storageKey);
			if (!raw) {
				return false;
			}

			try {
				const parsed = JSON.parse(raw) as {
					account?: { spaceId?: string | null };
				};
				return (
					typeof parsed.account?.spaceId === "string" &&
					parsed.account.spaceId.length > 0
				);
			} catch {
				return false;
			}
		},
		ADMIN_PERSIST_KEY,
		{ timeout: ADMIN_PERSIST_READY_TIMEOUT },
	);

	const raw = await readAdminPersistRaw(page);

	if (!raw) {
		return null;
	}

	const document = parseAdminPersistStorageDocument(raw);
	const account = document.account;
	if (!account) {
		return null;
	}

	return account.tenantId === expectedSelection.tenantId &&
		account.spaceId === expectedSelection.spaceId
		? document
		: null;
}

/**
 * Admin 앱에 OIDC UI 로그인 플로우를 수행합니다.
 *
 * 1. /admin/auth/login에서 OIDC interaction 로그인 폼으로 이동
 * 2. 시드 데이터의 PLATFORM_ADMIN 계정으로 로그인 (필요 시 consent 허용)
 * 3. /admin/dashboard 도달 후 앱 부트스트랩이 tenant/space를 확정할 때까지 대기
 *
 * @param page Admin E2E page
 * @returns 앱 부트스트랩이 확정한 tenant/space 선택값
 */
export async function loginToAdmin(page: Page) {
	const adminOrigin = new URL(ADMIN_ORIGIN).origin;
	await runOidcLoginFlow(page, {
		startPath: ADMIN_LOGIN_PATH,
		email: ADMIN_LOGIN_EMAIL,
		password: ADMIN_LOGIN_PASSWORD,
		finalUrl: (url: URL) =>
			url.origin === adminOrigin && url.pathname === ADMIN_DASHBOARD_PATH,
	});

	const selection = await waitForAdminSpaceSelection(page);
	await page.goto(ADMIN_DASHBOARD_PATH, { waitUntil: "domcontentloaded" });
	return selection;
}

async function waitForAdminSpaceSelection(
	page: Page,
): Promise<AdminPersistSpaceSelection> {
	const deadline = Date.now() + ADMIN_PERSIST_READY_TIMEOUT;
	while (Date.now() < deadline) {
		const selection = await readAdminPersistRawSelection(page);
		if (selection) {
			return selection;
		}

		await page.waitForTimeout(500);
	}

	throw new Error(
		"Admin space selection was not established after OIDC login.",
	);
}

async function readAdminPersistRaw(page: Page) {
	return page.evaluate(
		(storageKey) => window.localStorage.getItem(storageKey),
		ADMIN_PERSIST_KEY,
	);
}

/**
 * dev 서버에서 Next.js 경로를 사전 컴파일합니다.
 * 각 페이지를 순차적으로 방문해 on-demand compile 비용을 테스트 시작 전에 상쇄합니다.
 */
export async function prewarmAdminRoutes(page: Page) {
	for (const targetPath of ADMIN_PREWARM_PATHS) {
		try {
			await page.goto(targetPath, {
				waitUntil: "domcontentloaded",
				timeout: ROUTE_PREWARM_TIMEOUT,
			});
			await page.waitForLoadState("networkidle", { timeout: 2000 });
		} catch {
			// 누락된 페이지나 일시 오류는 전체 테스트를 막지 않도록 무시
		}
	}

	// 사전 컴파일 후 기본 대시보드로 복귀
	try {
		await page.goto(ADMIN_DASHBOARD_PATH, {
			waitUntil: "domcontentloaded",
			timeout: ROUTE_PREWARM_TIMEOUT,
		});
	} catch {
		// noop
	}
}

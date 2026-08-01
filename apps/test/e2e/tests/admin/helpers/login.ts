import {
	type AdminNativeAuthSession,
	type AdminPersistSpaceSelection,
	mergeAdminPersistAccountSelection,
	mergeAdminPersistAuthSession,
	parseAdminPersistStorageDocument,
} from "@cocrepo/e2e";
import type { Page } from "@playwright/test";

/** 시드 데이터 기준 System Tenant/Space (플랫폼 운영본부) */
const SYSTEM_TENANT_ID =
	process.env.E2E_SYSTEM_TENANT_ID ?? "01J00000000000000000000002";
const SYSTEM_SPACE_ID =
	process.env.E2E_SYSTEM_SPACE_ID ?? "01J00000000000000000000001";
const SYSTEM_FITNESS_CENTER_NAME = "플랫폼 운영본부";
const ADMIN_DASHBOARD_PATH = "/admin/dashboard";
const ADMIN_LOGIN_PATH = "/admin/auth/login";
const ADMIN_LOGIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "admin@plate.com";
const ADMIN_LOGIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "rkdmf12!@";
const ADMIN_PERSIST_KEY = "admin-persist";
const ADMIN_PERSIST_READY_TIMEOUT = 15_000;
const ROUTE_PREWARM_TIMEOUT = 10_000;
const ADMIN_API_BASE_URL =
	process.env.E2E_CORE_API_BASE_URL ??
	new URL(process.env.E2E_ADMIN_BASE_URL ?? "http://localhost:3000/admin/")
		.origin;
const CURRENT_SPACE_URL = new URL(
	"/api/v1/auth/current-space",
	ADMIN_API_BASE_URL,
).toString();
const NATIVE_LOGIN_URL = new URL(
	"/api/v1/auth/login",
	ADMIN_API_BASE_URL,
).toString();

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
 * Admin localStorage에서 현재 System Space를 포함한 persist 문서를 읽습니다.
 *
 * @param page Admin E2E page
 * @returns 검증된 persist 문서, 없으면 null
 */
export async function readAdminPersist(page: Page) {
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
	return document.account?.spaceId === SYSTEM_SPACE_ID ? document : null;
}

/**
 * Admin 앱에 native 로그인 플로우를 수행합니다.
 *
 * 1. /admin/auth/login에서 시드 데이터의 PLATFORM_ADMIN 계정으로 로그인
 * 2. native access/refresh token을 admin-persist에 저장
 * 3. current-space API로 System Space 선택 가능 여부를 확인
 * 4. Admin 대시보드로 리다이렉트
 * 5. space의 Space 정보를 보정하되 native token은 유지
 */
export async function loginToAdmin(page: Page) {
	await page.goto(ADMIN_LOGIN_PATH, { waitUntil: "domcontentloaded" });
	const session = await requestNativeLogin(page);
	await writeAdminNativeSession(page, session);
	const currentSpaceResponse = await page.request.post(CURRENT_SPACE_URL, {
		data: { tenantId: SYSTEM_TENANT_ID },
		headers: {
			Authorization: `Bearer ${session.accessToken}`,
		},
	});
	if (!currentSpaceResponse.ok()) {
		throw new Error("현재 Space 검증 API 호출에 실패했습니다.");
	}

	const currentSpaceBody = (await currentSpaceResponse.json()) as {
		data?: {
			id?: string;
			tenantId?: string | null;
			contentLanguageCode?: string | null;
			fitnessCenter?: { name?: string };
		};
	};
	if (currentSpaceBody.data?.id !== SYSTEM_SPACE_ID) {
		throw new Error("현재 Space 검증 결과가 기대한 Space와 일치하지 않습니다.");
	}
	if (currentSpaceBody.data?.tenantId !== SYSTEM_TENANT_ID) {
		throw new Error(
			"현재 Tenant 검증 결과가 기대한 Tenant와 일치하지 않습니다.",
		);
	}

	const currentFitnessCenterName =
		currentSpaceBody.data?.fitnessCenter?.name ?? SYSTEM_FITNESS_CENTER_NAME;
	if (currentFitnessCenterName !== SYSTEM_FITNESS_CENTER_NAME) {
		throw new Error(
			"현재 Space 검증 후 FitnessCenter 이름이 일치하지 않습니다.",
		);
	}

	await seedAdminPersist(page, {
		tenantId: SYSTEM_TENANT_ID,
		spaceId: SYSTEM_SPACE_ID,
		fitnessCenterName: currentFitnessCenterName,
		contentLanguageCode: currentSpaceBody.data?.contentLanguageCode ?? null,
	});
	await page.goto(ADMIN_DASHBOARD_PATH, { waitUntil: "domcontentloaded" });
}

async function requestNativeLogin(page: Page): Promise<AdminNativeAuthSession> {
	const response = await page.request.post(NATIVE_LOGIN_URL, {
		data: {
			email: ADMIN_LOGIN_EMAIL,
			password: ADMIN_LOGIN_PASSWORD,
		},
	});
	if (!response.ok()) {
		throw new Error(
			`native 로그인 API 호출에 실패했습니다: ${response.status()}`,
		);
	}

	const payload = (await response.json()) as {
		data?: Partial<AdminNativeAuthSession>;
	};
	const session = payload.data;
	if (
		typeof session?.accessToken !== "string" ||
		typeof session.refreshToken !== "string" ||
		typeof session.sessionId !== "string" ||
		typeof session.accessTokenExpiresAt !== "number" ||
		typeof session.refreshTokenExpiresAt !== "number"
	) {
		throw new Error("native 로그인 응답이 올바르지 않습니다.");
	}

	return {
		accessToken: session.accessToken,
		refreshToken: session.refreshToken,
		sessionId: session.sessionId,
		accessTokenExpiresAt: session.accessTokenExpiresAt,
		refreshTokenExpiresAt: session.refreshTokenExpiresAt,
	};
}

async function writeAdminNativeSession(
	page: Page,
	session: AdminNativeAuthSession,
) {
	const raw = await readAdminPersistRaw(page);
	const document = mergeAdminPersistAuthSession(raw, session);

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

import type { Page } from "@playwright/test";
import { runOidcLoginFlow } from "@cocrepo/e2e";

/** 시드 데이터 기준 System Space (플랫폼 운영본부) */
const SYSTEM_SPACE_ID =
	process.env.E2E_SYSTEM_SPACE_ID ?? "61ddca20-1752-466e-b4da-879ebdbe54e3";
const SYSTEM_GROUND_NAME = "플랫폼 운영본부";
const ADMIN_DASHBOARD_PATH = "/admin/dashboard";
const ADMIN_PERSIST_KEY = "admin-persist";
const ADMIN_PERSIST_READY_TIMEOUT = 15_000;
const ROUTE_PREWARM_TIMEOUT = 10_000;

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

type AdminPersistSnapshot = {
	spaceId: string | null;
	groundName: string | null;
	spaces: Array<{
		spaceId: string;
		groundName: string;
	}>;
	accessTokenExpiresAt: number | null;
	refreshTokenExpiresAt: number | null;
};

function buildAdminPersistSnapshot(
	raw: string | null,
	nextSpace: { spaceId: string; groundName: string },
): AdminPersistSnapshot {
	const fallbackSnapshot: AdminPersistSnapshot = {
		spaceId: nextSpace.spaceId,
		groundName: nextSpace.groundName,
		spaces: [nextSpace],
		accessTokenExpiresAt: null,
		refreshTokenExpiresAt: null,
	};

	if (!raw) {
		return fallbackSnapshot;
	}

	try {
		const parsed = JSON.parse(raw) as Partial<AdminPersistSnapshot>;
		const spaces = Array.isArray(parsed.spaces)
			? parsed.spaces.filter(
					(space): space is { spaceId: string; groundName: string } =>
						typeof space?.spaceId === "string" &&
						space.spaceId.length > 0 &&
						typeof space.groundName === "string",
				)
			: [];
		const hasSystemSpace = spaces.some(
			(space) => space.spaceId === nextSpace.spaceId,
		);

		return {
			spaceId: nextSpace.spaceId,
			groundName: nextSpace.groundName,
			spaces: hasSystemSpace ? spaces : [nextSpace, ...spaces],
			accessTokenExpiresAt:
				typeof parsed.accessTokenExpiresAt === "number"
					? parsed.accessTokenExpiresAt
					: null,
			refreshTokenExpiresAt:
				typeof parsed.refreshTokenExpiresAt === "number"
					? parsed.refreshTokenExpiresAt
					: null,
		};
	} catch {
		return fallbackSnapshot;
	}
}

async function ensureAdminDashboard(page: Page) {
	if (page.url().includes("/admin/")) {
		return;
	}

	await page.goto(ADMIN_DASHBOARD_PATH, {
		waitUntil: "domcontentloaded",
		timeout: ROUTE_PREWARM_TIMEOUT,
	});
}

export async function seedAdminPersist(
	page: Page,
	nextSpace: { spaceId: string; groundName: string },
) {
	await ensureAdminDashboard(page);
	await page.evaluate(
		({ storageKey, nextSpaceValue }) => {
			const raw = window.localStorage.getItem(storageKey);
			const fallbackSnapshot = {
				spaceId: nextSpaceValue.spaceId,
				groundName: nextSpaceValue.groundName,
				spaces: [nextSpaceValue],
				accessTokenExpiresAt: null,
				refreshTokenExpiresAt: null,
			};

			try {
				const parsed = raw ? JSON.parse(raw) : fallbackSnapshot;
				const spaces: Array<{ spaceId: string; groundName: string }> =
					Array.isArray(parsed?.spaces)
						? parsed.spaces.filter(
								(space: unknown): space is { spaceId: string; groundName: string } =>
									typeof space === "object" &&
									space !== null &&
									typeof (space as { spaceId?: unknown }).spaceId === "string" &&
									typeof (space as { groundName?: unknown }).groundName === "string",
							)
						: [];
				const hasSystemSpace = spaces.some(
					(space) => space.spaceId === nextSpaceValue.spaceId,
				);

				window.localStorage.setItem(
					storageKey,
					JSON.stringify({
						spaceId: nextSpaceValue.spaceId,
						groundName: nextSpaceValue.groundName,
						spaces: hasSystemSpace ? spaces : [nextSpaceValue, ...spaces],
						accessTokenExpiresAt:
							typeof parsed?.accessTokenExpiresAt === "number"
								? parsed.accessTokenExpiresAt
								: null,
						refreshTokenExpiresAt:
							typeof parsed?.refreshTokenExpiresAt === "number"
								? parsed.refreshTokenExpiresAt
								: null,
					}),
				);
			} catch {
				window.localStorage.setItem(
					storageKey,
					JSON.stringify(fallbackSnapshot),
				);
			}
		},
		{ storageKey: ADMIN_PERSIST_KEY, nextSpaceValue: nextSpace },
	);
}

export async function readAdminPersist(page: Page) {
	await ensureAdminDashboard(page);
	await page.waitForFunction(
		(storageKey) => {
			const raw = window.localStorage.getItem(storageKey);
			if (!raw) {
				return false;
			}

			try {
				const parsed = JSON.parse(raw) as { spaceId?: string | null };
				return typeof parsed.spaceId === "string" && parsed.spaceId.length > 0;
			} catch {
				return false;
			}
		},
		ADMIN_PERSIST_KEY,
		{ timeout: ADMIN_PERSIST_READY_TIMEOUT },
	);

	const raw = await page.evaluate(
		(storageKey) => window.localStorage.getItem(storageKey),
		ADMIN_PERSIST_KEY,
	);

	if (!raw) {
		return null;
	}

	return buildAdminPersistSnapshot(raw, {
		spaceId: SYSTEM_SPACE_ID,
		groundName: SYSTEM_GROUND_NAME,
	});
}

/**
 * Admin 앱에 OIDC 로그인 플로우를 수행합니다.
 *
 * 1. /api/v1/auth/login → IDP /interaction/[uid]
 * 2. 시드 데이터의 FULL_ACCESS 계정으로 로그인
 * 3. OIDC 동의 화면에서 "허용" 클릭
 * 4. Admin 대시보드로 리다이렉트
 * 5. current-space API로 System Space 선택 가능 여부를 확인하고 PersistStore를 맞춤
 */
export async function loginToAdmin(page: Page) {
	const isAdminUrl = (url: URL) =>
		url.pathname.startsWith("/admin") &&
		!url.pathname.includes("/auth/login");

	await runOidcLoginFlow(page, {
		startPath: "/api/v1/auth/login?clientId=admin-web",
		finalUrl: isAdminUrl,
		retryAttempts: 5,
		retryDelayMs: 1000,
		allowDirectRedirect: true,
	});

	// Next.js 앱은 후속 fetch로 networkidle이 길게 유지될 수 있어 DOM 준비만 대기합니다.
	await page.waitForLoadState("domcontentloaded");

	const currentSpaceResponse = await page.request.post(
		"http://localhost:3000/api/v1/auth/current-space",
		{
			data: { spaceId: SYSTEM_SPACE_ID },
		},
	);
	if (!currentSpaceResponse.ok()) {
		throw new Error("현재 Space 검증 API 호출에 실패했습니다.");
	}

	const currentSpaceBody = (await currentSpaceResponse.json()) as {
		data?: { id?: string; ground?: { name?: string } };
	};
	if (currentSpaceBody.data?.id !== SYSTEM_SPACE_ID) {
		throw new Error("현재 Space 검증 결과가 기대한 Space와 일치하지 않습니다.");
	}

	const currentSpaceName =
		currentSpaceBody.data?.ground?.name ?? SYSTEM_GROUND_NAME;
	if (currentSpaceName !== SYSTEM_GROUND_NAME) {
		throw new Error("현재 Space 검증 후 Space 이름이 일치하지 않습니다.");
	}

	await seedAdminPersist(page, {
		spaceId: SYSTEM_SPACE_ID,
		groundName: currentSpaceName,
	});
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

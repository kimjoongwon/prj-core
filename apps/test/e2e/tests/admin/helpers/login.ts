import type { Page } from "@playwright/test";
import { runOidcLoginFlow } from "@cocrepo/e2e";

/** 시드 데이터 기준 System Space (플랫폼 운영본부) */
const SYSTEM_SPACE_ID =
	process.env.E2E_SYSTEM_SPACE_ID ?? "61ddca20-1752-466e-b4da-879ebdbe54e3";
const SYSTEM_GROUND_NAME = "플랫폼 운영본부";

const ADMIN_PREWARM_PATHS = [
	"/admin/dashboard",
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

/**
 * Admin 앱에 OIDC 로그인 플로우를 수행합니다.
 *
 * 1. /api/v1/auth/login → IDP /interaction/[uid]
 * 2. 시드 데이터의 FULL_ACCESS 계정으로 로그인
 * 3. OIDC 동의 화면에서 "허용" 클릭
 * 4. Admin 대시보드로 리다이렉트
 * 5. localStorage에 Space 정보 설정 (X-Space-ID 헤더용)
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

	// localStorage에 System Space를 최종 확정 (앱 동기화 이후 덮어쓰기)
	const persistedSpaceId = await page.evaluate(
		({ spaceId, groundName }) => {
			const raw = localStorage.getItem("admin-persist");
			const parsed = raw ? JSON.parse(raw) : {};

			const spaces = Array.isArray(parsed.spaces)
				? parsed.spaces
				: [];
			const hasSystemSpace = spaces.some(
				(item: { spaceId?: string }) => item?.spaceId === spaceId,
			);

			const nextSpaces = hasSystemSpace
				? spaces
				: [...spaces, { spaceId, groundName }];

			localStorage.setItem(
				"admin-persist",
				JSON.stringify({
					...parsed,
					spaceId,
					groundName,
					spaces: nextSpaces,
				}),
			);

			const updated = localStorage.getItem("admin-persist");
			return updated ? JSON.parse(updated)?.spaceId ?? null : null;
		},
		{ spaceId: SYSTEM_SPACE_ID, groundName: SYSTEM_GROUND_NAME },
	);

	if (persistedSpaceId !== SYSTEM_SPACE_ID) {
		throw new Error("admin-persist spaceId 동기화에 실패했습니다.");
	}
}

/**
 * dev 서버에서 Next.js 경로를 사전 컴파일합니다.
 * 각 페이지를 순차적으로 방문해 on-demand compile 비용을 테스트 시작 전에 상쇄합니다.
 */
export async function prewarmAdminRoutes(page: Page) {
	for (const targetPath of ADMIN_PREWARM_PATHS) {
		try {
			await page.goto(targetPath, { waitUntil: "domcontentloaded" });
			await page.waitForLoadState("networkidle", { timeout: 2000 });
		} catch {
			// 누락된 페이지나 일시 오류는 전체 테스트를 막지 않도록 무시
		}
	}

	// 사전 컴파일 후 기본 대시보드로 복귀
	try {
		await page.goto("/admin/dashboard", { waitUntil: "domcontentloaded" });
	} catch {
		// noop
	}
}

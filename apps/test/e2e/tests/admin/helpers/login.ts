import type { Page } from "@playwright/test";

/** 시드 데이터 기준 FULL_ACCESS 계정 */
const ADMIN_EMAIL = "admin@plate.com";
const ADMIN_PASSWORD = "rkdmf12!@";

/** 시드 데이터 기준 System Space (플랫폼 운영본부) */
const SYSTEM_SPACE_ID =
	process.env.E2E_SYSTEM_SPACE_ID ?? "61ddca20-1752-466e-b4da-879ebdbe54e3";
const SYSTEM_GROUND_NAME = "플랫폼 운영본부";

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
	// 서버 라우트로 직접 진입해 클라이언트 hydration 의존 없이 OIDC 플로우 시작
	// 개발 환경에서 서버 부팅 타이밍 이슈가 있어 짧게 재시도합니다.
	let lastError: unknown;
	for (let attempt = 1; attempt <= 5; attempt++) {
		try {
			await page.goto("/api/v1/auth/login");
			lastError = null;
			break;
		} catch (error) {
			lastError = error;
			if (attempt === 5) {
				throw error;
			}
			await page.waitForTimeout(1000);
		}
	}

	if (lastError) {
		throw lastError;
	}

	// OIDC 리다이렉트 후 IDP 로그인 폼이 나타날 때까지 대기
	const loginButton = page.getByRole("button", { name: "로그인" });
	await loginButton.waitFor({ state: "visible", timeout: 30000 });

	// DEV 모드 자동 입력 값을 지우고 시드 데이터 계정 입력
	const emailInput = page.getByLabel("이메일");
	const passwordInput = page.getByLabel("비밀번호");

	await emailInput.clear();
	await emailInput.fill(ADMIN_EMAIL);
	await passwordInput.clear();
	await passwordInput.fill(ADMIN_PASSWORD);

	// 로그인 클릭
	await loginButton.click();

	const isAdminUrl = (url: URL) =>
		url.pathname.startsWith("/admin") &&
		!url.pathname.includes("/auth/login");
	const allowButton = page.getByRole("button", { name: "허용" });

	// 로그인 후 "동의 화면 노출" 또는 "바로 admin 리다이렉트"를 모두 허용
	let redirectedToAdmin = false;
	await Promise.race([
		page.waitForURL(isAdminUrl, { timeout: 30000 }).then(() => {
			redirectedToAdmin = true;
		}),
		allowButton.waitFor({ state: "visible", timeout: 30000 }),
	]);

	// 동의 화면이 나온 경우 허용 후 admin 리다이렉트 대기
	if (!redirectedToAdmin) {
		await allowButton.click();
		await page.waitForURL(isAdminUrl, { timeout: 30000 });
	}

	await page.waitForLoadState("networkidle");

	// localStorage에 System Space를 최종 확정 (앱 동기화 이후 덮어쓰기)
	await page.evaluate(
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
		},
		{ spaceId: SYSTEM_SPACE_ID, groundName: SYSTEM_GROUND_NAME },
	);

	await page.waitForFunction(
		(expectedSpaceId) => {
			const raw = localStorage.getItem("admin-persist");
			if (!raw) return false;
			const parsed = JSON.parse(raw);
			return parsed?.spaceId === expectedSpaceId;
		},
		SYSTEM_SPACE_ID,
		{ timeout: 10000 },
	);
}

const DEFAULT_RETURN_PATH = "/dashboard";
const DEFAULT_BASE_PATH = "/admin";

/**
 * 외부 URL 검증 후 앱 basePath를 제거한 router 내부 경로를 반환합니다.
 */
function stripBasePath(pathname: string, basePath: string) {
	if (!basePath || pathname === basePath) {
		return pathname === basePath ? "/" : pathname;
	}

	if (pathname.startsWith(`${basePath}/`)) {
		return pathname.slice(basePath.length);
	}

	return pathname;
}

/**
 * login returnTo query를 안전한 앱 내부 경로로 정규화합니다.
 */
export function resolveReturnPath(
	search = typeof window === "undefined" ? "" : window.location.search,
	origin = typeof window === "undefined" ? "" : window.location.origin,
	basePath = DEFAULT_BASE_PATH,
) {
	const searchParams = new URLSearchParams(search);
	const returnTo = searchParams.get("returnTo");
	if (!returnTo || !origin) {
		return DEFAULT_RETURN_PATH;
	}

	try {
		const url = new URL(returnTo, origin);
		if (url.origin !== origin) {
			return DEFAULT_RETURN_PATH;
		}

		const pathname = stripBasePath(url.pathname, basePath);
		return `${pathname}${url.search}${url.hash}`;
	} catch {
		return DEFAULT_RETURN_PATH;
	}
}

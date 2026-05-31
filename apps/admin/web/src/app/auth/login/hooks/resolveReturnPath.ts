const DEFAULT_RETURN_PATH = "/dashboard";
const ADMIN_BASE_PATH = "/admin";

function stripBasePath(pathname: string, basePath: string) {
	if (!basePath || pathname === basePath) {
		return pathname === basePath ? "/" : pathname;
	}

	if (pathname.startsWith(`${basePath}/`)) {
		return pathname.slice(basePath.length);
	}

	return pathname;
}

export function resolveReturnPath(
	search = typeof window === "undefined" ? "" : window.location.search,
	origin = typeof window === "undefined" ? "" : window.location.origin,
	basePath = ADMIN_BASE_PATH,
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

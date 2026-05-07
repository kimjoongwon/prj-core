import { Platform } from "react-native";

const DEFAULT_IDP_API_BASE_URL =
	Platform.OS === "android" ? "http://10.0.2.2:3007" : "http://localhost:3007";

const DEFAULT_CORE_API_BASE_URL =
	Platform.OS === "android" ? "http://10.0.2.2:3006" : "http://localhost:3006";

export const MOBILE_AUTH = {
	coreApiBaseUrl:
		typeof process === "undefined"
			? DEFAULT_CORE_API_BASE_URL
			: process.env.EXPO_PUBLIC_CORE_API_URL?.trim() ||
				process.env.EXPO_PUBLIC_CORE_API_INTERNAL_URL?.trim() ||
				process.env.EXPO_PUBLIC_CORE_API_BASE_URL?.trim() ||
				process.env.CORE_API_URL?.trim() ||
				process.env.CORE_API_INTERNAL_URL?.trim() ||
				DEFAULT_CORE_API_BASE_URL,
	idpApiBaseUrl:
		typeof process === "undefined"
			? DEFAULT_IDP_API_BASE_URL
			: process.env.EXPO_PUBLIC_IDP_API_URL?.trim() ||
					process.env.EXPO_PUBLIC_IDP_API_INTERNAL_URL?.trim() ||
					process.env.IDP_API_URL?.trim() ||
					process.env.IDP_API_INTERNAL_URL?.trim() ||
					DEFAULT_IDP_API_BASE_URL,
	loginClientId: "user-mobile",
	authenticatedHomePath: "/",
	loginPath: "/auth/login",
	authReturnPath: "/auth/callback",
};

const AUTHENTICATED_ROUTE_PATHS = ["/", "/reservations", "/profile"] as const;

export const getIdpApiBaseUrl = () => MOBILE_AUTH.idpApiBaseUrl.replace(/\/+$/, "");

export const getCoreApiBaseUrl = () =>
	MOBILE_AUTH.coreApiBaseUrl.replace(/\/+$/, "");

export const getAuthenticatedHomePath = () => MOBILE_AUTH.authenticatedHomePath;

export const getLoginPath = () => MOBILE_AUTH.loginPath;

export const buildLoginRedirectUrl = (
	returnToUrl: string,
	extraClientId = MOBILE_AUTH.loginClientId,
) => {
	const base = getIdpApiBaseUrl();
	const params = new URLSearchParams({
		clientId: extraClientId,
		returnTo: returnToUrl,
	});

	return `${base}/api/v1/auth/login?${params.toString()}`;
};

export const getCallbackPath = () => MOBILE_AUTH.authReturnPath;

export const getLoginUrl = (returnToUrl: string) =>
	buildLoginRedirectUrl(returnToUrl, MOBILE_AUTH.loginClientId);

export const isAuthCallbackRoute = (pathname = "") =>
	pathname === MOBILE_AUTH.authReturnPath;

export const isAuthRoute = (pathname = "") =>
	pathname.startsWith("/auth/") || pathname === "/auth/login";

export const isAuthenticatedRoute = (pathname = "") =>
	AUTHENTICATED_ROUTE_PATHS.includes(
		pathname as (typeof AUTHENTICATED_ROUTE_PATHS)[number],
	);

export const resolveAuthenticatedRoutePath = (pathname?: string | null) => {
	const normalizedPathname = pathname?.trim() || getAuthenticatedHomePath();
	const pathOnly = normalizedPathname.split("?")[0] || getAuthenticatedHomePath();

	return isAuthenticatedRoute(pathOnly) ? pathOnly : getAuthenticatedHomePath();
};

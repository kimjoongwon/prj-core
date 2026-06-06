import { Platform } from "react-native";

const DEFAULT_CORE_API_BASE_URL =
	Platform.OS === "android" ? "http://10.0.2.2:3006" : "http://localhost:3006";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const rewriteLocalhostBaseUrlForAndroidEmulator = (value: string) => {
	if (Platform.OS !== "android") {
		return value;
	}

	try {
		const parsed = new URL(value);
		if (parsed.hostname !== "localhost" && parsed.hostname !== "127.0.0.1") {
			return value;
		}

		parsed.hostname = "10.0.2.2";
		return parsed.toString();
	} catch {
		return value;
	}
};

const normalizeBaseUrl = (value: string) =>
	trimTrailingSlash(rewriteLocalhostBaseUrlForAndroidEmulator(value.trim()));

const getEnvValue = (key: string) =>
	typeof process === "undefined" ? undefined : process.env[key]?.trim();

const resolveMobileBaseUrl = (fallback: string, envKeys: string[]) => {
	const configured = envKeys
		.map((key) => getEnvValue(key))
		.find((value) => value && value.length > 0);

	return normalizeBaseUrl(configured ?? fallback);
};

export const MOBILE_AUTH = {
	coreApiBaseUrl: resolveMobileBaseUrl(DEFAULT_CORE_API_BASE_URL, [
		"EXPO_PUBLIC_CORE_API_URL",
		"EXPO_PUBLIC_CORE_API_INTERNAL_URL",
		"EXPO_PUBLIC_CORE_API_BASE_URL",
		"CORE_API_URL",
		"CORE_API_INTERNAL_URL",
	]),
	idpApiBaseUrl: resolveMobileBaseUrl(DEFAULT_CORE_API_BASE_URL, [
		"EXPO_PUBLIC_AUTH_API_BASE_URL",
		"EXPO_PUBLIC_CORE_API_URL",
		"EXPO_PUBLIC_CORE_API_INTERNAL_URL",
		"EXPO_PUBLIC_CORE_API_BASE_URL",
		"CORE_API_URL",
		"CORE_API_INTERNAL_URL",
	]),
	loginClientId: "user-mobile",
	authenticatedHomePath: "/",
	loginPath: "/auth/login",
	spaceSelectPath: "/select-space",
};

const AUTHENTICATED_ROUTE_PATHS = [
	"/",
	"/payments/checkout",
	"/profile",
	"/reservations",
	"/select-space",
] as const;

export const getIdpApiBaseUrl = () => trimTrailingSlash(MOBILE_AUTH.idpApiBaseUrl);

export const getCoreApiBaseUrl = () =>
	trimTrailingSlash(MOBILE_AUTH.coreApiBaseUrl);

export const getAuthenticatedHomePath = () => MOBILE_AUTH.authenticatedHomePath;

export const getLoginPath = () => MOBILE_AUTH.loginPath;

export const getSpaceSelectPath = () => MOBILE_AUTH.spaceSelectPath;

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

import { Platform } from "react-native";

const DEFAULT_IDP_API_BASE_URL =
	Platform.OS === "android" ? "http://10.0.2.2:3007" : "http://localhost:3007";

export const MOBILE_AUTH = {
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

export const getIdpApiBaseUrl = () => MOBILE_AUTH.idpApiBaseUrl.replace(/\/+$/, "");

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

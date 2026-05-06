import { Platform } from "react-native";

export type AuthQueryValue = string | string[];

interface PrimitiveAuthParams {
	clientId?: string;
	returnTo?: string;
	apiBaseUrl?: string;
	callbackScheme?: string;
	callbackPath?: string;
}

export interface MobileAuthLoginParams extends PrimitiveAuthParams {
	targetReturnTo?: string;
}

export interface MobileAuthCallbackExchangeInput extends PrimitiveAuthParams {
	code?: string;
	state?: string;
}

export interface MobileAuthCallbackExchangeResult {
	status: "ok" | "error" | "redirect";
	statusCode: number;
	location?: string;
	error?: string;
}

export interface MobileAuthCallbackHandleResult {
	status: "success" | "error" | "invalid";
	nextRoute: string;
	message: string;
	exchange?: MobileAuthCallbackExchangeResult;
}

interface AuthCallbackResultState {
	status: "loading" | "success" | "error";
	nextRoute: string;
	message: string;
	exchange?: MobileAuthCallbackExchangeResult;
}

export type MobileAuthCallbackTransitionState = AuthCallbackResultState;

export interface AuthCallbackQuery {
	code?: AuthQueryValue;
	state?: AuthQueryValue;
	error?: AuthQueryValue;
	error_description?: AuthQueryValue;
	returnTo?: AuthQueryValue;
	return_to?: AuthQueryValue;
	clientId?: AuthQueryValue;
}

export interface AuthLoginFlowState {
	status: "loading" | "ready" | "error" | "cancelled";
	message: string;
	errorMessage: string;
}

export interface MobileAuthLoginQuery {
	returnTo?: AuthQueryValue;
	clientId?: AuthQueryValue;
}

const DEFAULT_CLIENT_ID = "user-mobile";
const DEFAULT_AUTH_CALLBACK_SCHEME = "kr.co.cocdev.onoramobile";
const DEFAULT_AUTH_CALLBACK_PATH = "auth/callback";
const DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO = "/";
const DEFAULT_IDP_API_BASE_URL =
	Platform.OS === "android" ? "http://10.0.2.2:3007" : "http://localhost:3007";

const API_ENV_KEYS = [
	"EXPO_PUBLIC_IDP_API_URL",
	"EXPO_PUBLIC_IDP_API_INTERNAL_URL",
	"EXPO_PUBLIC_IDP_API_BASE_URL",
	"EXPO_PUBLIC_IDP_BASE_URL",
	"EXPO_PUBLIC_API_BASE_URL",
	"EXPO_PUBLIC_SERVER_BASE_URL",
	"EXPO_PUBLIC_IDP_CLIENT_URL",
	"EXPO_PUBLIC_AUTH_API_BASE_URL",
	"IDP_API_URL",
	"IDP_API_INTERNAL_URL",
	"IDP_API_BASE_URL",
];

const toStringArray = (value: AuthQueryValue | undefined): string[] =>
	typeof value === "string" ? [value] : value ?? [];

const firstQueryValue = (value: AuthQueryValue | undefined): string | undefined => {
	for (const item of toStringArray(value)) {
		const trimmed = item.trim();
		if (trimmed) {
			return trimmed;
		}
	}

	return undefined;
};

const trimTrailingSlash = (value: string) =>
	value.endsWith("/") ? value.replace(/\/+$/, "") : value;

const ensureLeadingSlash = (value: string) =>
	value.startsWith("/") ? value : `/${value}`;

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value);

const normalizeRoute = (value: string) => {
	const trimmed = value.trim();
	if (!trimmed) {
		return DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO;
	}

	if (trimmed.startsWith("/")) {
		return trimmed;
	}

	const withoutQuery = trimmed.split("?")[0] ?? "";
	if (!withoutQuery || withoutQuery.includes("://")) {
		return DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO;
	}

	return `/${withoutQuery}`;
};

const buildApiBaseUrl = (overrideBaseUrl?: string) => {
	const configured = [
		overrideBaseUrl,
		...API_ENV_KEYS.map((key) => process.env[key]),
	].find((candidate) => typeof candidate === "string" && candidate.trim().length > 0);

	if (configured) {
		return trimTrailingSlash(configured.trim());
	}

	if (
		Platform.OS === "web" &&
		typeof window !== "undefined" &&
		window.location?.origin
	) {
		return window.location.origin.replace(/\/+$/, "");
	}

	return DEFAULT_IDP_API_BASE_URL;
};

const buildEndpoint = (path: string, base?: string) => {
	const normalizedPath = ensureLeadingSlash(path);
	if (!base) {
		return normalizedPath;
	}

	const trimmedBase = trimTrailingSlash(base);
	if (isHttpUrl(trimmedBase)) {
		return new URL(normalizedPath, `${trimmedBase}/`).toString();
	}

	if (trimmedBase.startsWith("/")) {
		if (trimmedBase === "/") {
			return normalizedPath;
		}

		if (normalizedPath.startsWith(`${trimmedBase}/`)) {
			return normalizedPath;
		}

		return `${trimmedBase}${normalizedPath}`;
	}

	return `${trimmedBase}${normalizedPath}`;
};

export const rewriteLocalhostUrlForAndroidEmulator = (
	value: string,
	platformOs: typeof Platform.OS = Platform.OS,
) => {
	if (platformOs !== "android") {
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

const buildCallbackSearchParams = (returnTo?: string) => {
	const params = new URLSearchParams();
	params.set("returnTo", returnTo ?? DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO);
	return params;
};

export const buildAuthSessionRedirectUrl = (options: PrimitiveAuthParams = {}) => {
	const scheme = (options.callbackScheme ?? DEFAULT_AUTH_CALLBACK_SCHEME).trim();
	const path = (options.callbackPath ?? DEFAULT_AUTH_CALLBACK_PATH)
		.trim()
		.replace(/^\/+/, "");

	return `${scheme}://${path}`;
};

const buildAuthCallbackUrl = (options: PrimitiveAuthParams = {}) => {
	const returnTo = options.returnTo
		? normalizeRoute(options.returnTo)
		: DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO;

	const callbackUrl = buildAuthSessionRedirectUrl(options);
	const params = buildCallbackSearchParams(returnTo);

	return `${callbackUrl}?${params.toString()}`;
};

const normalizeCallbackPath = (value: string) =>
	value.trim().replace(/^\/+/, "").replace(/\/+$/, "");

const getCallbackUrlPath = (url: URL) =>
	[url.host, normalizeCallbackPath(url.pathname)]
		.filter((part) => part.length > 0)
		.join("/");

export const isAuthCallbackUrl = (
	value: string,
	options: PrimitiveAuthParams = {},
) => {
	try {
		const scheme = (options.callbackScheme ?? DEFAULT_AUTH_CALLBACK_SCHEME)
			.trim()
			.toLowerCase();
		const path = normalizeCallbackPath(
			options.callbackPath ?? DEFAULT_AUTH_CALLBACK_PATH,
		);
		const parsed = new URL(value);

		return (
			parsed.protocol.replace(/:$/, "").toLowerCase() === scheme &&
			getCallbackUrlPath(parsed) === path
		);
	} catch {
		return false;
	}
};

export const buildAuthCallbackRouteParams = (
	value: string,
	fallbackReturnTo = DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO,
) => {
	const parsed = new URL(value);
	const params: Record<string, string> = {};

	parsed.searchParams.forEach((paramValue, key) => {
		params[key] = paramValue;
	});

	if (!params.returnTo && !params.return_to) {
		params.returnTo = fallbackReturnTo;
	}

	return params;
};

export const buildAuthLoginUrl = (options: MobileAuthLoginParams = {}) => {
	const apiBase = buildApiBaseUrl(options.apiBaseUrl);
	const clientId = options.clientId?.trim() || DEFAULT_CLIENT_ID;
	const targetReturnTo = options.targetReturnTo
		? normalizeRoute(options.targetReturnTo)
		: DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO;
	const callbackUrl = buildAuthCallbackUrl({
		callbackScheme: options.callbackScheme,
		callbackPath: options.callbackPath,
		returnTo: targetReturnTo,
	});
	const loginParams = new URLSearchParams({
		clientId,
		returnTo: callbackUrl,
	});
	const endpoint = buildEndpoint("/api/v1/auth/login", apiBase);

	return `${endpoint}?${loginParams.toString()}`;
};

export const createLoginLoadingState = (): AuthLoginFlowState => ({
	status: "loading",
	message: "안전한 로그인 화면을 준비하고 있습니다.",
	errorMessage: "",
});

export const createLoginSuccessState = (): AuthLoginFlowState => ({
	status: "ready",
	message: "로그인 화면이 준비되었습니다.",
	errorMessage: "",
});

export const createLoginErrorState = (errorMessage: string): AuthLoginFlowState => ({
	status: "error",
	message: "로그인 화면을 불러오지 못했습니다.",
	errorMessage,
});

export const createLoginCancelledState = (): AuthLoginFlowState => ({
	status: "cancelled",
	message: "로그인을 다시 시작할 수 있습니다.",
	errorMessage: "로그인이 취소되었습니다. 다시 시도해 주세요.",
});

export const buildAuthCallbackLoadingState = (): MobileAuthCallbackTransitionState => ({
	status: "loading",
	exchange: undefined,
	message: "로그인 정보를 확인하고 있습니다. 잠시만 기다려 주세요.",
	nextRoute: DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO,
});

export const buildAuthCallbackSuccessState = (
	nextRoute: string,
	message: string,
	exchange?: MobileAuthCallbackExchangeResult,
): MobileAuthCallbackTransitionState => ({
	status: "success",
	exchange,
	message,
	nextRoute: normalizeRoute(nextRoute),
});

export const buildAuthCallbackErrorState = (
	nextRoute: string,
	message: string,
	exchange?: MobileAuthCallbackExchangeResult,
): MobileAuthCallbackTransitionState => ({
	status: "error",
	exchange,
	message,
	nextRoute: normalizeRoute(nextRoute),
});

export const parseAuthCallbackReturnTarget = (value?: string): string => {
	const normalizedValue = value?.trim() || "";
	if (!normalizedValue) {
		return DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO;
	}

	try {
		const fallbackParsed = new URL(
			normalizedValue,
			"kr.co.cocdev.onoramobile://auth/callback",
		);
		const direct = fallbackParsed.searchParams.get("returnTo");
		if (direct) {
			return normalizeRoute(decodeURIComponent(direct));
		}

		if (fallbackParsed.pathname === "/auth/callback") {
			const nestedLegacy = fallbackParsed.searchParams.get("return_to");
			if (nestedLegacy) {
				return normalizeRoute(decodeURIComponent(nestedLegacy));
			}
		}

		return normalizeRoute(fallbackParsed.pathname);
	} catch {
		return normalizeRoute(normalizedValue);
	}
};

export const exchangeAuthCallback = async (
	params: MobileAuthCallbackExchangeInput,
): Promise<MobileAuthCallbackExchangeResult> => {
	const code = firstQueryValue(params.code);
	const state = firstQueryValue(params.state);
	if (!code || !state) {
		return {
			status: "error",
			statusCode: 400,
			error: "로그인 정보가 올바르지 않습니다. 다시 로그인해 주세요.",
		};
	}

	const clientId = params.clientId?.trim() || DEFAULT_CLIENT_ID;
	const apiBase = buildApiBaseUrl(params.apiBaseUrl);
	const endpoint = buildEndpoint("/api/v1/auth/callback", apiBase);
	const query = new URLSearchParams({ clientId, code, state });
	const callbackUrl = `${endpoint}?${query.toString()}`;

	try {
		const response = await fetch(callbackUrl, {
			method: "GET",
			redirect: "manual",
			headers: {
				Accept: "*/*",
			},
		});
		const location = response.headers.get("location");

		if (response.status >= 300 && response.status < 400) {
			return {
				status: "redirect",
				statusCode: response.status,
				location: location ?? undefined,
			};
		}

		if (!response.ok) {
			return {
				status: "error",
				statusCode: response.status,
				error: "로그인 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.",
			};
		}

		return {
			status: "ok",
			statusCode: response.status,
			location: location ?? undefined,
		};
	} catch {
		return {
			status: "error",
			statusCode: 500,
			error: "로그인 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.",
		};
	}
};

export const resolveAuthCallbackResult = async (
	params: AuthCallbackQuery,
	options: PrimitiveAuthParams = {},
): Promise<MobileAuthCallbackHandleResult> => {
	const code = firstQueryValue(params.code);
	const state = firstQueryValue(params.state);
	const errorFromIdp = firstQueryValue(params.error);
	const errorDescription = firstQueryValue(params.error_description);
	const returnTo = firstQueryValue(params.returnTo) ?? firstQueryValue(params.return_to);
	const apiBaseUrl = options.apiBaseUrl;

	if (errorFromIdp) {
		return {
			status: "error",
			nextRoute: DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO,
			message:
				errorDescription || "로그인을 완료하지 못했습니다. 다시 시도해 주세요.",
		};
	}

	const directReturnRoute = parseAuthCallbackReturnTarget(returnTo);
	if (!code || !state) {
		if (returnTo) {
			return {
				status: "success",
				nextRoute: directReturnRoute,
				message: "로그인이 완료되었습니다. 예약 화면으로 이동합니다.",
			};
		}

		return {
			status: "invalid",
			nextRoute: DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO,
			message: "로그인 정보가 올바르지 않습니다. 다시 로그인해 주세요.",
		};
	}

	const exchangeResult = await exchangeAuthCallback({
		clientId: options.clientId,
		code,
		state,
		apiBaseUrl,
	});
	if (exchangeResult.status === "error") {
		return {
			status: "error",
			nextRoute: directReturnRoute,
			exchange: exchangeResult,
			message:
				exchangeResult.error ??
				"로그인 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.",
		};
	}

	let nextRoute = directReturnRoute;
	if (exchangeResult.location) {
		nextRoute = parseAuthCallbackReturnTarget(exchangeResult.location);
	}

	return {
		status: "success",
		nextRoute,
		exchange: exchangeResult,
		message: "로그인이 완료되었습니다. 예약 화면으로 이동합니다.",
	};
};

export const parseAuthLoginParams = (params: Record<string, unknown>) => {
	const returnTo = firstQueryValue(
		params.returnTo as AuthQueryValue | undefined,
	) ?? firstQueryValue(params.return_to as AuthQueryValue | undefined);
	const clientId = firstQueryValue(
		params.clientId as AuthQueryValue | undefined,
	);

	return {
		returnTo: returnTo ?? DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO,
		clientId,
	};
};

export const verifySession = async (
	params: AuthCallbackQuery,
	options: PrimitiveAuthParams = {},
): Promise<MobileAuthCallbackTransitionState> => {
	try {
		const result = await resolveAuthCallbackResult(params, options);
		if (result.status === "success") {
			return buildAuthCallbackSuccessState(
				result.nextRoute,
				result.message,
				result.exchange,
			);
		}

		return buildAuthCallbackErrorState(
			result.nextRoute,
			result.message || "로그인 처리에 실패했습니다. 다시 시도해 주세요.",
			result.exchange,
		);
	} catch {
		return buildAuthCallbackErrorState(
			DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO,
			"로그인 상태를 확인하지 못했습니다. 다시 시도해 주세요.",
		);
	}
};

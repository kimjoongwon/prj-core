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

export interface MobileAuthCallbackTransitionState extends AuthCallbackResultState {}

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
	status: "loading" | "ready" | "error";
	message: string;
	errorMessage: string;
}

export interface MobileAuthLoginQuery {
	returnTo?: AuthQueryValue;
	clientId?: AuthQueryValue;
}

const DEFAULT_CLIENT_ID = "idp-web";
const DEFAULT_AUTH_CALLBACK_SCHEME = "prjcore";
const DEFAULT_AUTH_CALLBACK_PATH = "auth/callback";
const DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO = "/";
const DEFAULT_IDP_API_BASE_URL =
	Platform.OS === "android" ? "http://10.0.2.2:3007" : "http://localhost:3007";
const ANDROID_EMULATOR_HOST = "10.0.2.2";

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

const buildCallbackSearchParams = (returnTo?: string) => {
	const params = new URLSearchParams();
	params.set("returnTo", returnTo ?? DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO);
	return params;
};

const buildAuthCallbackUrl = (options: PrimitiveAuthParams = {}) => {
	const scheme = (options.callbackScheme ?? DEFAULT_AUTH_CALLBACK_SCHEME).trim();
	const path = (options.callbackPath ?? DEFAULT_AUTH_CALLBACK_PATH)
		.trim()
		.replace(/^\/+/, "");
	const returnTo = options.returnTo
		? normalizeRoute(options.returnTo)
		: DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO;

	const callbackUrl = `${scheme}://${path}`;
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

export const rewriteLocalhostUrlForAndroidEmulator = (
	value: string,
	platform = Platform.OS,
) => {
	if (platform !== "android") {
		return value;
	}

	try {
		const parsed = new URL(value);
		if (parsed.hostname !== "localhost" && parsed.hostname !== "127.0.0.1") {
			return value;
		}

		parsed.hostname = ANDROID_EMULATOR_HOST;
		return parsed.toString();
	} catch {
		return value;
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
	message: "오노라 로그인 화면을 준비하고 있습니다.",
	errorMessage: "",
});

export const createLoginSuccessState = (loginUrl: string): AuthLoginFlowState => ({
	status: "ready",
	message: `오노라 로그인 화면을 표시합니다. target=${loginUrl}`,
	errorMessage: "",
});

export const createLoginErrorState = (errorMessage: string): AuthLoginFlowState => ({
	status: "error",
	message: "오노라 로그인 화면을 불러오지 못했습니다.",
	errorMessage,
});

export const buildAuthCallbackLoadingState = (): MobileAuthCallbackTransitionState => ({
	status: "loading",
	exchange: undefined,
	message: "오노라 인증 콜백을 처리하고 있습니다.",
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
		const fallbackParsed = new URL(normalizedValue, "prjcore://auth/callback");
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
			error: "오노라 인증을 위한 code 또는 state가 없습니다.",
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
				error: `오노라 인증 콜백 API 응답 오류: ${response.status}`,
			};
		}

		return {
			status: "ok",
			statusCode: response.status,
			location: location ?? undefined,
		};
	} catch (error) {
		return {
			status: "error",
			statusCode: 500,
			error:
				error instanceof Error
					? error.message
					: "오노라 인증 콜백 API 호출 실패",
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
			message: errorDescription || errorFromIdp,
		};
	}

	const directReturnRoute = parseAuthCallbackReturnTarget(returnTo);
	if (!code || !state) {
		if (returnTo) {
			return {
				status: "success",
				nextRoute: directReturnRoute,
				message: "오노라 인증 서버에서 복귀 URL을 해석해 이동합니다.",
			};
		}

		return {
			status: "invalid",
			nextRoute: DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO,
			message: "오노라 인증 콜백 파라미터가 없습니다.",
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
			message: exchangeResult.error ?? "오노라 인증 콜백 교환에 실패했습니다.",
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
		message:
			exchangeResult.location !== undefined
				? "오노라 인증 결과를 서버에서 전달받아 리다이렉트 위치를 적용했습니다."
				: "오노라 인증 콜백을 처리했습니다.",
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
			return buildAuthCallbackSuccessState(result.nextRoute, result.message, result.exchange);
		}

		return buildAuthCallbackErrorState(
			result.nextRoute,
			result.message || "오노라 인증 처리가 실패했습니다.",
			result.exchange,
		);
	} catch (error) {
		return buildAuthCallbackErrorState(
			DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO,
			error instanceof Error
				? error.message
				: "오노라 인증 세션 검증 중 오류가 발생했습니다.",
		);
	}
};

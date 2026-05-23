import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { MobileSpaceInfo } from "../mobile-api-scope";

export type AuthQueryValue = string | string[];

interface PrimitiveAuthParams {
	apiBaseUrl?: string;
}

export interface MobileAuthLoginParams extends PrimitiveAuthParams {
	targetReturnTo?: string;
	clientId?: string;
}

export interface MobileAuthSession {
	accessToken?: string | null;
	accessTokenExpiresAt?: number | null;
	refreshToken?: string | null;
	refreshTokenExpiresAt?: number | null;
	sessionId?: string | null;
	mustChangePassword?: boolean | null;
}

export interface NativeLoginInput extends PrimitiveAuthParams {
	email: string;
	password: string;
}

export interface NativeRefreshInput extends PrimitiveAuthParams {
	sessionId: string;
	refreshToken: string;
}

export interface NativeLogoutInput extends PrimitiveAuthParams {
	accessToken?: string | null;
	sessionId: string;
	refreshToken?: string | null;
}

export interface MobileAuthCallbackTransitionState {
	status: "loading" | "success" | "error";
	nextRoute: string;
	message: string;
}

export interface MobileAuthLoginQuery {
	returnTo?: AuthQueryValue;
	clientId?: AuthQueryValue;
}

interface ApiResponseEnvelope<T> {
	data?: T;
	displayMessage?: string;
	error?: string;
	message?: string;
}

const DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO = "/";
const DEFAULT_IDP_API_BASE_URL =
	Platform.OS === "android" ? "http://10.0.2.2:3007" : "http://localhost:3007";
const NATIVE_SESSION_STORAGE_KEY = "onora.mobile.native.session.v1";
const NATIVE_SPACE_SELECTION_STORAGE_KEY =
	"onora.mobile.native.space-selection.v1";

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

export class NativeAuthRequestError extends Error {
	constructor(
		message: string,
		readonly statusCode: number,
		readonly response?: ApiResponseEnvelope<unknown>,
	) {
		super(message);
		this.name = "NativeAuthRequestError";
	}
}

const toStringArray = (value: AuthQueryValue | undefined): string[] =>
	typeof value === "string" ? [value] : (value ?? []);

const firstQueryValue = (
	value: AuthQueryValue | undefined,
): string | undefined => {
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

const normalizeApiBaseUrl = (value: string) =>
	trimTrailingSlash(rewriteLocalhostUrlForAndroidEmulator(value.trim()));

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
	].find(
		(candidate) => typeof candidate === "string" && candidate.trim().length > 0,
	);

	if (configured) {
		return normalizeApiBaseUrl(configured);
	}

	if (
		Platform.OS === "web" &&
		typeof window !== "undefined" &&
		window.location?.origin
	) {
		return window.location.origin.replace(/\/+$/, "");
	}

	return normalizeApiBaseUrl(DEFAULT_IDP_API_BASE_URL);
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

const readJsonEnvelope = async <T>(
	response: Response,
): Promise<ApiResponseEnvelope<T>> => {
	const contentType = response.headers.get("content-type") ?? "";
	if (!contentType.toLowerCase().includes("application/json")) {
		return {};
	}

	try {
		return (await response.json()) as ApiResponseEnvelope<T>;
	} catch {
		return {};
	}
};

const unwrapData = <T>(payload: ApiResponseEnvelope<T>): T | undefined => {
	if (payload.data) {
		return payload.data;
	}

	return payload as T;
};

const buildErrorMessage = (payload: ApiResponseEnvelope<unknown>) =>
	payload.displayMessage ??
	payload.message ??
	payload.error ??
	"인증 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.";

const requestNativeAuth = async <T>(
	path: string,
	body: Record<string, unknown>,
	options: PrimitiveAuthParams = {},
	headers: Record<string, string> = {},
): Promise<T> => {
	const endpoint = buildEndpoint(path, buildApiBaseUrl(options.apiBaseUrl));
	const response = await fetch(endpoint, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			...headers,
		},
		method: "POST",
		body: JSON.stringify(body),
	});
	const payload = await readJsonEnvelope<T>(response);

	if (!response.ok) {
		throw new NativeAuthRequestError(
			buildErrorMessage(payload),
			response.status,
			payload,
		);
	}

	const data = unwrapData(payload);
	if (!data) {
		throw new NativeAuthRequestError(
			"인증 응답이 올바르지 않습니다. 다시 시도해 주세요.",
			response.status,
			payload,
		);
	}

	return data;
};

export const buildNativeLoginEndpoint = (
	options: PrimitiveAuthParams = {},
): string =>
	buildEndpoint(
		"/api/v1/auth/native/login",
		buildApiBaseUrl(options.apiBaseUrl),
	);

export const buildAuthLoginUrl = (
	options: MobileAuthLoginParams = {},
): string => buildNativeLoginEndpoint(options);

export const requestNativeLogin = (
	input: NativeLoginInput,
): Promise<MobileAuthSession> =>
	requestNativeAuth<MobileAuthSession>("/api/v1/auth/native/login", {
		email: input.email,
		password: input.password,
	}, input);

export const requestNativeTokenRefresh = (
	input: NativeRefreshInput,
): Promise<MobileAuthSession> =>
	requestNativeAuth<MobileAuthSession>("/api/v1/auth/native/token/refresh", {
		sessionId: input.sessionId,
		refreshToken: input.refreshToken,
	}, input);

export const requestNativeLogout = (
	input: NativeLogoutInput,
): Promise<boolean> =>
	requestNativeAuth<boolean>(
		"/api/v1/auth/native/logout",
		{
			sessionId: input.sessionId,
			refreshToken: input.refreshToken,
		},
		input,
		input.accessToken
			? {
					Authorization: `Bearer ${input.accessToken}`,
				}
			: {},
	);

export const saveNativeAuthSession = async (session: MobileAuthSession) => {
	await SecureStore.setItemAsync(
		NATIVE_SESSION_STORAGE_KEY,
		JSON.stringify(session),
	);
};

export const loadNativeAuthSession =
	async (): Promise<MobileAuthSession | null> => {
		const rawSession = await SecureStore.getItemAsync(NATIVE_SESSION_STORAGE_KEY);
		if (!rawSession) {
			return null;
		}

		try {
			return JSON.parse(rawSession) as MobileAuthSession;
		} catch {
			await clearNativeAuthSession();
			return null;
		}
	};

export const clearNativeAuthSession = async () => {
	await SecureStore.deleteItemAsync(NATIVE_SESSION_STORAGE_KEY);
};

export const saveNativeSpaceSelection = async (space: MobileSpaceInfo) => {
	await SecureStore.setItemAsync(
		NATIVE_SPACE_SELECTION_STORAGE_KEY,
		JSON.stringify(space),
	);
};

export const loadNativeSpaceSelection =
	async (): Promise<MobileSpaceInfo | null> => {
		const rawSelection = await SecureStore.getItemAsync(
			NATIVE_SPACE_SELECTION_STORAGE_KEY,
		);
		if (!rawSelection) {
			return null;
		}

		try {
			return JSON.parse(rawSelection) as MobileSpaceInfo;
		} catch {
			await clearNativeSpaceSelection();
			return null;
		}
	};

export const clearNativeSpaceSelection = async () => {
	await SecureStore.deleteItemAsync(NATIVE_SPACE_SELECTION_STORAGE_KEY);
};

export const buildAuthCallbackLoadingState =
	(): MobileAuthCallbackTransitionState => ({
		status: "loading",
		message: "로그인 정보를 확인하고 있습니다. 잠시만 기다려 주세요.",
		nextRoute: DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO,
	});

export const buildAuthCallbackErrorState = (
	nextRoute: string,
	message: string,
): MobileAuthCallbackTransitionState => ({
	status: "error",
	message,
	nextRoute: normalizeRoute(nextRoute),
});

export const parseAuthLoginParams = (params: Record<string, unknown>) => {
	const returnTo =
		firstQueryValue(params.returnTo as AuthQueryValue | undefined) ??
		firstQueryValue(params.return_to as AuthQueryValue | undefined);
	const clientId = firstQueryValue(
		params.clientId as AuthQueryValue | undefined,
	);

	return {
		returnTo: returnTo ?? DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO,
		clientId,
	};
};

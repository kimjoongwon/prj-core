import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { MobileSpaceInfo } from "../mobile-api-scope";

export type AuthQueryValue = string | string[];

export interface MobileAuthSession {
	accessToken?: string | null;
	accessTokenExpiresAt?: number | null;
	refreshToken?: string | null;
	refreshTokenExpiresAt?: number | null;
	sessionId?: string | null;
	mustChangePassword?: boolean | null;
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

const DEFAULT_AUTH_CALLBACK_FALLBACK_RETURN_TO = "/";
const NATIVE_SESSION_STORAGE_KEY = "onora.mobile.native.session.v1";
const NATIVE_SPACE_SELECTION_STORAGE_KEY =
	"onora.mobile.native.space-selection.v1";
const NATIVE_SPACE_SELECTION_PERSIST_VERSION = 2 as const;

interface PersistedNativeSpaceSelection extends MobileSpaceInfo {
	version: typeof NATIVE_SPACE_SELECTION_PERSIST_VERSION;
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

const isOptionalNullableString = (value: unknown) =>
	value === undefined || value === null || typeof value === "string";

const isPersistedNativeSpaceSelection = (
	value: unknown,
): value is PersistedNativeSpaceSelection => {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	const selection = value as Record<string, unknown>;
	return (
		selection.version === NATIVE_SPACE_SELECTION_PERSIST_VERSION &&
		typeof selection.tenantId === "string" &&
		typeof selection.spaceId === "string" &&
		typeof selection.fitnessCenterName === "string" &&
		isOptionalNullableString(selection.address) &&
		isOptionalNullableString(selection.contentLanguageCode) &&
		isOptionalNullableString(selection.imageFileId) &&
		isOptionalNullableString(selection.logoImageFileId)
	);
};

/**
 * 현재 모바일 Space/FitnessCenter 선택을 versioned SecureStore payload로 저장합니다.
 */
export const saveNativeSpaceSelection = async (space: MobileSpaceInfo) => {
	await SecureStore.setItemAsync(
		NATIVE_SPACE_SELECTION_STORAGE_KEY,
		JSON.stringify({
			version: NATIVE_SPACE_SELECTION_PERSIST_VERSION,
			...space,
		} satisfies PersistedNativeSpaceSelection),
	);
};

/**
 * version 2 선택만 복원하고 versionless 또는 이전 payload는 폐기합니다.
 */
export const loadNativeSpaceSelection =
	async (): Promise<MobileSpaceInfo | null> => {
		const rawSelection = await SecureStore.getItemAsync(
			NATIVE_SPACE_SELECTION_STORAGE_KEY,
		);
		if (!rawSelection) {
			return null;
		}

		try {
			const selection = JSON.parse(rawSelection) as unknown;
			if (!isPersistedNativeSpaceSelection(selection)) {
				await clearNativeSpaceSelection();
				return null;
			}

			return {
				address: selection.address,
				contentLanguageCode: selection.contentLanguageCode,
				fitnessCenterName: selection.fitnessCenterName,
				imageFileId: selection.imageFileId,
				logoImageFileId: selection.logoImageFileId,
				spaceId: selection.spaceId,
				tenantId: selection.tenantId,
			};
		} catch {
			await clearNativeSpaceSelection();
			return null;
		}
	};

/**
 * 모바일 Space/FitnessCenter 선택 payload를 삭제합니다.
 */
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

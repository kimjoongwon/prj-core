import { REQUEST_HEADER_KEYS } from "@cocrepo/constant";
import {
	type ApiRequestInit,
	ApiClientError,
	apiJsonStringify,
	executeApiFetch,
	isApiClientError,
	setConfiguredApiBaseUrl,
} from "./apiFetchCore";

// 생성 코드 codemod(scripts/serialize-fetch-bodies.mjs)가 customFetch와 같은
// 경로에서 import하므로 재수출 경로를 유지한다.
export { apiJsonStringify };
export { ApiClientError, isApiClientError } from "./apiFetchCore";
export type { ApiRequestInit } from "./apiFetchCore";

// 세션/tenant scope 참조 (앱 초기화 시 설정)
interface SessionScopeRef {
	accessToken?: string | null;
	accessTokenExpiresAt?: number | null;
	refreshToken?: string | null;
	refreshTokenExpiresAt?: number | null;
	sessionId?: string | null;
	tenantId?: string | null;
}
let sessionScopeRef: SessionScopeRef | null = null;

interface LocaleRef {
	languageCode?: string | null;
}
let localeRef: LocaleRef | null = null;

/**
 * API 베이스 URL 수동 설정 (SSR/테스트 환경, 모바일 앱의 서버 주소).
 */
export function setApiBaseUrl(baseUrl: string) {
	setConfiguredApiBaseUrl(baseUrl);
}

/**
 * 토큰 갱신 응답과 tenant header를 반영하기 위한 참조 설정입니다.
 */
export function setApiSessionScope(scope: SessionScopeRef) {
	sessionScopeRef = scope;
}

export function setApiLocale(store: LocaleRef) {
	localeRef = store;
}

/**
 * 세션 복구 정책.
 *
 * - refreshSession: 401 발생 시 세션을 갱신한다. 실패(throw)하면 만료로 본다.
 * - onSessionExpired: 갱신 실패 또는 갱신 요청 자체의 401 시 호출한다.
 *   (예: 브라우저 앱은 로그인 화면으로 보낸다. 미설정 시 그대로 실패시킨다.)
 */
export interface CoreSessionRecoveryPolicy {
	refreshSession: () => Promise<void>;
	onSessionExpired?: () => void;
}

let sessionRecoveryPolicy: CoreSessionRecoveryPolicy | null = null;
let isRefreshing = false;
let failedQueue: Array<{
	resolve: (value: unknown) => void;
	reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
	for (const { resolve, reject } of failedQueue) {
		if (error) {
			reject(error);
		} else {
			resolve(undefined);
		}
	}
	failedQueue = [];
};

/**
 * 세션 복구 정책을 설치한다.
 *
 * customFetch의 401 처리(갱신 후 재시도, 만료 시 알림)는 앱별 정책이므로 여기서
 * 기본 동작으로 심지 않고, 인증 세션을 소유한 앱(admin web, mobile)이
 * 부트스트랩에서 설치한다. 정책 없이는 401을 그대로 호출자에게 돌려준다.
 * (로그인 UI[idp/web]처럼 401이 자격 증명 불일치를 의미하는 화면은 설치하지
 * 않는다.) 재호출은 정책만 교체한다.
 */
export function installCoreSessionRecovery(policy: CoreSessionRecoveryPolicy) {
	sessionRecoveryPolicy = policy;
}

const isSessionRefreshRequest = (url: string) =>
	url.includes("/auth/token/refresh");

/** 요청에 세션/로케일 헤더를 주입한다. 인증 헤더는 호출자가 명시한 값이 우선한다. */
const applySessionHeaders = (headers: Headers) => {
	const accessToken = sessionScopeRef?.accessToken;
	const refreshToken = sessionScopeRef?.refreshToken;
	const tenantId = sessionScopeRef?.tenantId;
	const languageCode = localeRef?.languageCode;

	if (accessToken && !headers.has("Authorization")) {
		headers.set("Authorization", `Bearer ${accessToken}`);
	}
	if (refreshToken && !headers.has(REQUEST_HEADER_KEYS.REFRESH_TOKEN)) {
		headers.set(REQUEST_HEADER_KEYS.REFRESH_TOKEN, refreshToken);
	}
	if (tenantId) {
		headers.set(REQUEST_HEADER_KEYS.TENANT_ID, tenantId);
	}
	if (languageCode) {
		headers.set(REQUEST_HEADER_KEYS.LANGUAGE, languageCode);
	}
};

const issueCoreRequest = <T>(url: string, options: ApiRequestInit) => {
	const headers = new Headers(options.headers);
	applySessionHeaders(headers);
	return executeApiFetch<T>(url, { ...options, headers });
};

/** 409 Conflict는 서버 응답 본문의 message로 에러 메시지를 교체한다. */
const decorateCoreFailure = (error: unknown) => {
	if (isApiClientError(error) && error.status === 409) {
		const responseBody = error.body as { message?: string } | null;
		const conflictMessage =
			responseBody?.message || "충돌이 발생했습니다. 다시 시도해주세요.";
		console.error("409 Conflict Error:", conflictMessage);
		error.message = conflictMessage;
	}
	return error;
};

const retryCoreRequest = async <T>(
	url: string,
	options: ApiRequestInit,
): Promise<T> => {
	try {
		return await issueCoreRequest<T>(url, options);
	} catch (retryError) {
		throw decorateCoreFailure(retryError);
	}
};

const recoverCoreSession = async <T>(
	requestError: unknown,
	url: string,
	options: ApiRequestInit,
): Promise<T> => {
	if (
		!isApiClientError(requestError) ||
		requestError.status !== 401 ||
		!sessionRecoveryPolicy
	) {
		throw decorateCoreFailure(requestError);
	}

	if (isSessionRefreshRequest(url)) {
		// 갱신 요청 자체의 401은 재시도 없이 만료 처리한다.
		sessionRecoveryPolicy.onSessionExpired?.();
		throw requestError;
	}

	// 이미 갱신 중이면 큐에 추가하여 대기 후 재시도한다.
	if (isRefreshing) {
		await new Promise<void>((resolve, reject) => {
			failedQueue.push({ resolve: () => resolve(undefined), reject });
		});
		return retryCoreRequest<T>(url, options);
	}

	isRefreshing = true;
	try {
		await sessionRecoveryPolicy.refreshSession();
		processQueue(null);
		return await retryCoreRequest<T>(url, options);
	} catch (refreshError) {
		processQueue(refreshError);
		sessionRecoveryPolicy.onSessionExpired?.();
		throw refreshError;
	} finally {
		isRefreshing = false;
	}
};

/**
 * orval mutator — 모든 생성 클라이언트가 거치는 공용 fetch 진입점.
 *
 * 세션 헤더 주입, 401 갱신/재시도(정책 설치 시), 런타임 타입 응답 변환을
 * 수행하고 응답 본문만 반환한다. url은 query string을 포함한 최종 경로다.
 */
export const customFetch = async <T>(
	url: string,
	options: ApiRequestInit = {},
): Promise<T> => {
	try {
		return await issueCoreRequest<T>(url, options);
	} catch (requestError) {
		return recoverCoreSession<T>(requestError, url, options);
	}
};

const applyTokenRefreshData = (responseData?: {
	accessToken?: string;
	accessTokenExpiresAt?: number;
	refreshToken?: string;
	refreshTokenExpiresAt?: number;
	sessionId?: string | null;
}) => {
	if (!responseData || !sessionScopeRef) {
		return;
	}

	sessionScopeRef.accessToken =
		responseData.accessToken ?? sessionScopeRef.accessToken ?? null;
	sessionScopeRef.refreshToken =
		responseData.refreshToken ?? sessionScopeRef.refreshToken ?? null;
	sessionScopeRef.sessionId =
		responseData.sessionId ?? sessionScopeRef.sessionId ?? null;
	if (responseData.accessTokenExpiresAt) {
		sessionScopeRef.accessTokenExpiresAt = responseData.accessTokenExpiresAt;
		sessionScopeRef.refreshTokenExpiresAt = responseData.refreshTokenExpiresAt;
	}
};

let sessionRefreshInFlight: Promise<boolean> | null = null;

/**
 * 쿠키 기반 token/refresh를 단일 비행으로 수행한다. 마운트 직후 여러 경로
 * (SessionBootstrap, 세션 복구 정책)가 동시에 갱신하면 로테이션되는 refresh
 * token이 경합해 401이 발생하므로 진행 중인 호출을 공유한다. 갱신 결과는
 * sessionScope(스토어)에 반영된다.
 */
export async function refreshSessionTokens(): Promise<boolean> {
	if (!sessionRefreshInFlight) {
		sessionRefreshInFlight = (async () => {
			try {
				const refreshResponse = await issueCoreRequest<{
					data?: {
						accessToken?: string;
						accessTokenExpiresAt?: number;
						refreshToken?: string;
						refreshTokenExpiresAt?: number;
						sessionId?: string | null;
					};
				}>("/api/v1/auth/token/refresh", { method: "POST" });
				const responseData = refreshResponse?.data;
				applyTokenRefreshData(responseData);
				return Boolean(responseData?.accessToken && responseData?.sessionId);
			} catch (refreshError) {
				if (isApiClientError(refreshError) && refreshError.status === 401) {
					sessionRecoveryPolicy?.onSessionExpired?.();
				}
				return false;
			} finally {
				sessionRefreshInFlight = null;
			}
		})();
	}

	return sessionRefreshInFlight;
}

/**
 * 에러에서 사용자에게 보여줄 메시지를 뽑는다.
 * 응답 본문의 error/message → 에러 기본 message → fallback 순서.
 */
export const readApiErrorMessage = (
	error: unknown,
	fallbackMessage: string,
): string => {
	if (isApiClientError(error)) {
		const responseBody = error.body as
			| { message?: string; error?: string }
			| null;
		return (
			responseBody?.error ||
			responseBody?.message ||
			error.message ||
			fallbackMessage
		);
	}
	if (error instanceof Error && error.message) {
		return error.message;
	}
	return fallbackMessage;
};

// 생성 코드의 TError 기본값. ApiClientError로 응답 상태/본문에 접근한다.
export type ErrorType<Error = unknown> = ApiClientError<Error>;

export type BodyType<BodyData> = BodyData;

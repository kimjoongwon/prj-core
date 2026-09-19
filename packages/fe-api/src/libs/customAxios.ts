import { REQUEST_HEADER_KEYS } from "@cocrepo/constant";
import Axios, {
	type AxiosError,
	AxiosHeaders,
	type AxiosRequestConfig,
	type InternalAxiosRequestConfig,
} from "axios";
import { runtimeManifest } from "./runtimeManifest";
import { transformRequestConfig, transformResponseData } from "./runtimeSchema";

const DEFAULT_CORE_API_SERVER_BASE_URL =
	(typeof process !== "undefined"
		? process.env.CORE_API_INTERNAL_URL
		: undefined) ?? "http://localhost:3006";

function resolveServerBaseUrl(url?: string) {
	if (typeof window !== "undefined" || !url?.startsWith("/")) {
		return undefined;
	}

	return DEFAULT_CORE_API_SERVER_BASE_URL;
}

// 브라우저에서는 같은 origin 상대경로를 사용하고,
// 서버 컴포넌트/SSR에서는 runtime env 기반 internal URL을 사용합니다.
export const AXIOS_INSTANCE = Axios.create({
	timeout: 10000, // 10초 타임아웃
	withCredentials: true, // 쿠키/인증 정보 포함
});

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
 * API 베이스 URL 수동 설정 (SSR/테스트 환경에서 통합 Axios 인스턴스에 사용)
 */
export function setApiBaseUrl(baseUrl: string) {
	AXIOS_INSTANCE.defaults.baseURL = baseUrl;
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
let isSessionRecoveryInterceptorInstalled = false;
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
 * 인터셉터의 401 처리(갱신 후 재시도, 만료 시 알림)는 앱별 정책이므로 여기서
 * 기본 동작으로 심지 않고, 인증 세션을 소유한 앱(admin web, mobile)이
 * 부트스트랩에서 설치한다. 정책 없이는 401을 그대로 호출자에게 돌려준다.
 * (로그인 UI[idp/web]처럼 401이 자격 증명 불일치를 의미하는 화면은 설치하지
 * 않는다.) 설치는 한 번만 인터셉터를 등록하며 재호출은 정책만 교체한다.
 */
export function installCoreSessionRecovery(policy: CoreSessionRecoveryPolicy) {
	sessionRecoveryPolicy = policy;

	if (isSessionRecoveryInterceptorInstalled) {
		return;
	}
	isSessionRecoveryInterceptorInstalled = true;
	AXIOS_INSTANCE.interceptors.response.use(undefined, onAxiosFailure);
}

const isSessionRefreshRequest = (url?: string) =>
	url?.includes("/auth/token/refresh");

const onAxiosFailure = async (error: AxiosError) => {
	const originalRequest = error.config as InternalAxiosRequestConfig & {
		_retry?: boolean;
	};

	const canAttemptRecovery =
		Boolean(sessionRecoveryPolicy) &&
		error.response?.status === 401 &&
		Boolean(originalRequest) &&
		!originalRequest._retry;

	if (canAttemptRecovery && isSessionRefreshRequest(originalRequest.url)) {
		// 갱신 요청 자체의 401은 재시도 없이 만료 처리한다.
		sessionRecoveryPolicy?.onSessionExpired?.();
		return Promise.reject(error);
	}

	if (canAttemptRecovery) {
		// 이미 갱신 중이면 큐에 추가하여 대기
		if (isRefreshing) {
			return new Promise((resolve, reject) => {
				failedQueue.push({ resolve, reject });
			}).then(() => AXIOS_INSTANCE(syncSessionHeaders(originalRequest)));
		}

		originalRequest._retry = true;
		isRefreshing = true;

		try {
			await sessionRecoveryPolicy?.refreshSession();
			processQueue(null);
			return AXIOS_INSTANCE(syncSessionHeaders(originalRequest));
		} catch (refreshError) {
			processQueue(refreshError);
			sessionRecoveryPolicy?.onSessionExpired?.();
			return Promise.reject(refreshError);
		} finally {
			isRefreshing = false;
		}
	}

	// 409 Conflict 에러 처리
	if (error.response?.status === 409) {
		const responseData = error.response.data as { message?: string };
		const errorMessage =
			responseData?.message || "충돌이 발생했습니다. 다시 시도해주세요.";
		console.error("409 Conflict Error:", errorMessage);

		// 에러 객체에 사용자 친화적인 메시지 추가
		error.message = errorMessage;
	}
	return Promise.reject(error);
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
				const refreshResponse = await AXIOS_INSTANCE.post(
					"/api/v1/auth/token/refresh",
				);
				const responseData = (
					refreshResponse.data as {
						data?: {
							accessToken?: string;
							accessTokenExpiresAt?: number;
							refreshToken?: string;
							refreshTokenExpiresAt?: number;
							sessionId?: string | null;
						};
					}
				)?.data;
				applyTokenRefreshData(responseData);
				return Boolean(responseData?.accessToken && responseData?.sessionId);
			} catch {
				return false;
			} finally {
				sessionRefreshInFlight = null;
			}
		})();
	}

	return sessionRefreshInFlight;
}

const syncSessionHeaders = (config: InternalAxiosRequestConfig) => {
	const headers = AxiosHeaders.from(config.headers);
	const accessToken = sessionScopeRef?.accessToken;
	const refreshToken = sessionScopeRef?.refreshToken;
	const tenantId = sessionScopeRef?.tenantId;
	const languageCode = localeRef?.languageCode;

	if (accessToken) {
		headers.set("Authorization", `Bearer ${accessToken}`);
	}

	if (refreshToken) {
		headers.set(REQUEST_HEADER_KEYS.REFRESH_TOKEN, refreshToken);
	}

	if (tenantId) {
		headers.set(REQUEST_HEADER_KEYS.TENANT_ID, tenantId);
	}

	if (languageCode) {
		headers.set(REQUEST_HEADER_KEYS.LANGUAGE, languageCode);
	}

	config.headers = headers;
	return config;
};

AXIOS_INSTANCE.interceptors.request.use((config) => {
	const headers = AxiosHeaders.from(config.headers);
	const accessToken = sessionScopeRef?.accessToken;
	const refreshToken = sessionScopeRef?.refreshToken;
	const tenantId = sessionScopeRef?.tenantId;

	if (accessToken && !headers.has("Authorization")) {
		headers.set("Authorization", `Bearer ${accessToken}`);
	}

	if (refreshToken && !headers.has(REQUEST_HEADER_KEYS.REFRESH_TOKEN)) {
		headers.set(REQUEST_HEADER_KEYS.REFRESH_TOKEN, refreshToken);
	}

	if (tenantId) {
		headers.set(REQUEST_HEADER_KEYS.TENANT_ID, tenantId);
	}

	const languageCode = localeRef?.languageCode;
	if (languageCode) {
		headers.set(REQUEST_HEADER_KEYS.LANGUAGE, languageCode);
	}

	config.headers = headers;
	return config;
});

// add a second `options` argument here if you want to override each generated query with some options
export const customInstance = <T>(
	config: AxiosRequestConfig,
	options?: AxiosRequestConfig,
): Promise<T> => {
	const source = Axios.CancelToken.source();
	const headers = {
		...config.headers,
		...options?.headers,
	};
	const baseURL =
		options?.baseURL ?? config.baseURL ?? resolveServerBaseUrl(config.url);
	const requestConfig = transformRequestConfig({
		...config,
		...options,
		headers,
		...(baseURL ? { baseURL } : {}),
		cancelToken: source.token,
	}, runtimeManifest);
	const promise = AXIOS_INSTANCE(requestConfig).then(({ data, status, config: responseConfig }) =>
		transformResponseData(data, status, responseConfig.method, responseConfig.url, runtimeManifest) as T,
	);

	// @ts-expect-error
	promise.cancel = () => {
		source.cancel("Query was cancelled");
	};

	return promise;
};

// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;

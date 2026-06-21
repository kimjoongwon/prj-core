import { REQUEST_HEADER_KEYS } from "@cocrepo/constant";
import Axios, {
	type AxiosError,
	AxiosHeaders,
	type AxiosRequestConfig,
	type InternalAxiosRequestConfig,
} from "axios";

const DEFAULT_AUTH_SERVER_BASE_URL =
	(typeof process !== "undefined"
		? process.env.CORE_API_INTERNAL_URL
		: undefined) ?? "http://localhost:3006";

function resolveServerBaseUrl(url?: string) {
	if (typeof window !== "undefined" || !url?.startsWith("/")) {
		return undefined;
	}

	return DEFAULT_AUTH_SERVER_BASE_URL;
}

// IDP용 Axios 인스턴스
export const IDP_AXIOS_INSTANCE = Axios.create({
	timeout: 10000,
	withCredentials: true,
});

// PersistStore 참조 (앱 초기화 시 설정)
interface PersistStoreRef {
	accessToken?: string | null;
	accessTokenExpiresAt?: number | null;
	refreshToken?: string | null;
	refreshTokenExpiresAt?: number | null;
	sessionId?: string | null;
	tenantId?: string | null;
}
let persistStoreRef: PersistStoreRef | null = null;

type NativeRefreshHandler = () => Promise<void>;
let nativeRefreshHandler: NativeRefreshHandler | null = null;

interface LocaleStoreRef {
	languageCode?: string | null;
}
let localeStoreRef: LocaleStoreRef | null = null;

// 401 발생 시 리다이렉트할 로그인 URL
let loginRedirectUrl = "/admin/auth/login";

// IDP base URL 설정 (앱 초기화 시 호출)
export function setIdpBaseUrl(baseUrl: string) {
	IDP_AXIOS_INSTANCE.defaults.baseURL = baseUrl;
}

/**
 * IDP Axios에 PersistStore 참조 설정
 * 토큰 갱신 시 만료 시간 업데이트에 사용
 */
export function setIdpPersistStore(store: PersistStoreRef) {
	persistStoreRef = store;
}

export function setIdpNativeRefreshHandler(
	handler: NativeRefreshHandler | null,
) {
	nativeRefreshHandler = handler;
}

export function setIdpLocaleStore(store: LocaleStoreRef) {
	localeStoreRef = store;
}

/**
 * IDP Axios의 로그인 리다이렉트 URL 설정
 */
export function setIdpLoginRedirectUrl(url: string) {
	loginRedirectUrl = url;
}

// 토큰 갱신 상태 관리
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

const applyTokenRefreshData = (responseData?: {
	accessToken?: string;
	accessTokenExpiresAt?: number;
	refreshToken?: string;
	refreshTokenExpiresAt?: number;
	sessionId?: string;
}) => {
	if (!responseData || !persistStoreRef) {
		return;
	}

	persistStoreRef.accessToken =
		responseData.accessToken ?? persistStoreRef.accessToken ?? null;
	persistStoreRef.refreshToken =
		responseData.refreshToken ?? persistStoreRef.refreshToken ?? null;
	persistStoreRef.sessionId =
		responseData.sessionId ?? persistStoreRef.sessionId ?? null;
	if (responseData.accessTokenExpiresAt) {
		persistStoreRef.accessTokenExpiresAt = responseData.accessTokenExpiresAt;
		persistStoreRef.refreshTokenExpiresAt = responseData.refreshTokenExpiresAt;
	}
};

const syncSessionHeaders = (config: InternalAxiosRequestConfig) => {
	const headers = AxiosHeaders.from(config.headers);
	const accessToken = persistStoreRef?.accessToken;
	const refreshToken = persistStoreRef?.refreshToken;
	const tenantId = persistStoreRef?.tenantId;
	const languageCode = localeStoreRef?.languageCode;

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

IDP_AXIOS_INSTANCE.interceptors.request.use((config) => {
	const headers = AxiosHeaders.from(config.headers);
	const accessToken = persistStoreRef?.accessToken;
	const refreshToken = persistStoreRef?.refreshToken;
	const tenantId = persistStoreRef?.tenantId;

	if (accessToken && !headers.has("Authorization")) {
		headers.set("Authorization", `Bearer ${accessToken}`);
	}

	if (refreshToken && !headers.has(REQUEST_HEADER_KEYS.REFRESH_TOKEN)) {
		headers.set(REQUEST_HEADER_KEYS.REFRESH_TOKEN, refreshToken);
	}

	if (tenantId && !headers.has(REQUEST_HEADER_KEYS.TENANT_ID)) {
		headers.set(REQUEST_HEADER_KEYS.TENANT_ID, tenantId);
	}

	const languageCode = localeStoreRef?.languageCode;
	if (languageCode && !headers.has(REQUEST_HEADER_KEYS.LANGUAGE)) {
		headers.set(REQUEST_HEADER_KEYS.LANGUAGE, languageCode);
	}

	config.headers = headers;
	return config;
});

// Response 인터셉터: 401 토큰 갱신
IDP_AXIOS_INSTANCE.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const isBrowser = typeof window !== "undefined";
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		const canHandleRefresh = isBrowser || nativeRefreshHandler;

		if (
			canHandleRefresh &&
			error.response?.status === 401 &&
			originalRequest &&
			!originalRequest._retry
		) {
			// refresh 엔드포인트 자체의 401은 갱신 시도하지 않음
			if (
				originalRequest.url?.includes("/auth/token/refresh") ||
				originalRequest.url?.includes("/auth/native/token/refresh")
			) {
				if (isBrowser && !nativeRefreshHandler) {
					window.location.href = loginRedirectUrl;
				}
				return Promise.reject(error);
			}

			// 이미 갱신 중이면 큐에 추가하여 대기
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				}).then(() => IDP_AXIOS_INSTANCE(syncSessionHeaders(originalRequest)));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				if (nativeRefreshHandler) {
					await nativeRefreshHandler();
				} else {
					const refreshResponse = await IDP_AXIOS_INSTANCE.post(
						"/api/v1/auth/token/refresh",
					);
					const responseData = (
						refreshResponse.data as {
							data?: {
								accessToken?: string;
								accessTokenExpiresAt?: number;
								refreshToken?: string;
								refreshTokenExpiresAt?: number;
							};
						}
					)?.data;
					applyTokenRefreshData(responseData);
				}
				processQueue(null);
				return IDP_AXIOS_INSTANCE(syncSessionHeaders(originalRequest));
			} catch (refreshError) {
				processQueue(refreshError);
				if (isBrowser && !nativeRefreshHandler) {
					window.location.href = loginRedirectUrl;
				}
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	},
);

export const customIdpInstance = <T>(
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
	const promise = IDP_AXIOS_INSTANCE({
		...config,
		...options,
		headers,
		...(baseURL ? { baseURL } : {}),
		cancelToken: source.token,
	}).then(({ data }) => data);

	// @ts-expect-error
	promise.cancel = () => {
		source.cancel("Query was cancelled");
	};

	return promise;
};

export type ErrorType<Error> = import("axios").AxiosError<Error>;

export type BodyType<BodyData> = BodyData;

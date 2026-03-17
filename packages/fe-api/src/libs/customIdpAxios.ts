import Axios, {
	type AxiosError,
	type AxiosRequestConfig,
	type InternalAxiosRequestConfig,
} from "axios";

const DEFAULT_IDP_API_SERVER_BASE_URL =
	process.env.IDP_API_INTERNAL_URL ?? "http://localhost:3007";

function resolveServerBaseUrl(url?: string) {
	if (typeof window !== "undefined" || !url?.startsWith("/")) {
		return undefined;
	}

	return DEFAULT_IDP_API_SERVER_BASE_URL;
}

// IDP용 Axios 인스턴스
export const IDP_AXIOS_INSTANCE = Axios.create({
	timeout: 10000,
	withCredentials: true,
});

// PersistStore 참조 (앱 초기화 시 설정)
interface PersistStoreRef {
	spaceId: string | null;
	accessTokenExpiresAt?: number | null;
	refreshTokenExpiresAt?: number | null;
}
let persistStoreRef: PersistStoreRef | null = null;

// 401 발생 시 리다이렉트할 로그인 URL
let loginRedirectUrl = "/admin/auth/login";

// IDP base URL 설정 (앱 초기화 시 호출)
export function setIdpBaseUrl(baseUrl: string) {
	IDP_AXIOS_INSTANCE.defaults.baseURL = baseUrl;
}

/**
 * IDP Axios에 PersistStore 참조 설정
 * x-space-id 헤더 추가 및 토큰 갱신 시 만료 시간 업데이트에 사용
 */
export function setIdpPersistStore(store: PersistStoreRef) {
	persistStoreRef = store;
}

/**
 * IDP Axios의 로그인 리다이렉트 URL 설정
 */
export function setIdpLoginRedirectUrl(url: string) {
	loginRedirectUrl = url;
}

// Request 인터셉터: x-space-id 헤더 추가
IDP_AXIOS_INSTANCE.interceptors.request.use(
	(config) => {
		if (persistStoreRef?.spaceId) {
			config.headers["x-space-id"] = persistStoreRef.spaceId;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

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

// Response 인터셉터: 401 토큰 갱신
IDP_AXIOS_INSTANCE.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const isBrowser = typeof window !== "undefined";
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		if (
			isBrowser &&
			error.response?.status === 401 &&
			originalRequest &&
			!originalRequest._retry
		) {
			// refresh 엔드포인트 자체의 401은 갱신 시도하지 않음
			if (originalRequest.url?.includes("/auth/token/refresh")) {
				window.location.href = loginRedirectUrl;
				return Promise.reject(error);
			}

			// 이미 갱신 중이면 큐에 추가하여 대기
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				}).then(() => IDP_AXIOS_INSTANCE(originalRequest));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				// auth 모듈이 idp-server에 있으므로 같은 인스턴스로 refresh 요청
				const refreshResponse = await IDP_AXIOS_INSTANCE.post(
					"/api/v1/auth/token/refresh",
				);
				const responseData = (
					refreshResponse.data as {
						data?: {
							accessTokenExpiresAt?: number;
							refreshTokenExpiresAt?: number;
						};
					}
				)?.data;
				if (responseData?.accessTokenExpiresAt && persistStoreRef) {
					persistStoreRef.accessTokenExpiresAt =
						responseData.accessTokenExpiresAt;
					persistStoreRef.refreshTokenExpiresAt =
						responseData.refreshTokenExpiresAt;
				}
				processQueue(null);
				return IDP_AXIOS_INSTANCE(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError);
				window.location.href = loginRedirectUrl;
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

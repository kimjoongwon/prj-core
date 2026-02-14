import Axios, {
	type AxiosError,
	type AxiosRequestConfig,
	type InternalAxiosRequestConfig,
} from "axios";

// Orval이 완전한 URL을 생성하므로 baseURL 불필요
export const AXIOS_INSTANCE = Axios.create({
	// baseURL 제거 - Orval 생성 코드가 완전한 URL 사용
	timeout: 10000, // 10초 타임아웃
	withCredentials: true, // 쿠키/인증 정보 포함
}); // Orval 생성 코드가 환경별 완전한 URL을 제공

// PersistStore 참조 (앱 초기화 시 설정)
interface PersistStoreRef {
	spaceId: string | null;
	accessTokenExpiresAt?: number | null;
	refreshTokenExpiresAt?: number | null;
}
let persistStoreRef: PersistStoreRef | null = null;

// 401 발생 시 리다이렉트할 로그인 URL (앱별 설정 가능)
let loginRedirectUrl = "/admin/auth/login";

/**
 * 401 토큰 만료 시 리다이렉트할 로그인 URL 설정
 * 앱 초기화 시 호출하여 앱별 로그인 경로를 지정합니다.
 */
export function setLoginRedirectUrl(url: string) {
	loginRedirectUrl = url;
}

/**
 * API 요청에 x-space-id 헤더를 추가하기 위한 PersistStore 참조 설정
 * 앱 초기화 시 호출하여 Store 참조를 주입합니다.
 */
export function setApiPersistStore(store: PersistStoreRef) {
	persistStoreRef = store;
}

// Request 인터셉터: x-space-id 헤더 추가
AXIOS_INSTANCE.interceptors.request.use(
	(config) => {
		// spaceId가 있으면 헤더에 추가
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

// Response 인터셉터: 401 토큰 갱신 + 409 에러 처리
AXIOS_INSTANCE.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		// 401 토큰 만료 시 갱신 시도
		if (
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
				}).then(() => AXIOS_INSTANCE(originalRequest));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const refreshResponse = await AXIOS_INSTANCE.post("/api/v1/auth/token/refresh");
				// refresh 응답에서 만료 시간 추출하여 PersistStore 업데이트
				const responseData = (refreshResponse.data as { data?: { accessTokenExpiresAt?: number; refreshTokenExpiresAt?: number } })?.data;
				if (responseData?.accessTokenExpiresAt && persistStoreRef) {
					persistStoreRef.accessTokenExpiresAt = responseData.accessTokenExpiresAt;
					persistStoreRef.refreshTokenExpiresAt = responseData.refreshTokenExpiresAt;
				}
				processQueue(null);
				// 갱신 성공 → 원래 요청 재시도 (새 쿠키 자동 적용)
				return AXIOS_INSTANCE(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError);
				window.location.href = loginRedirectUrl;
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
	},
);

// add a second `options` argument here if you want to pass extra options to each generated query
export const customInstance = <T>(
	config: AxiosRequestConfig,
	options?: AxiosRequestConfig,
): Promise<T> => {
	const source = Axios.CancelToken.source();
	const headers = {
		...config.headers,
		...options?.headers,
	};
	const promise = AXIOS_INSTANCE({
		...config,
		...options,
		headers,
		cancelToken: source.token,
	}).then(({ data }) => data);

	// @ts-expect-error
	promise.cancel = () => {
		source.cancel("Query was cancelled");
	};

	return promise;
};

// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;

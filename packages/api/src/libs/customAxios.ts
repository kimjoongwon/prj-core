import Axios, { AxiosError, AxiosRequestConfig } from "axios";

// Orval이 완전한 URL을 생성하므로 baseURL 불필요
export const AXIOS_INSTANCE = Axios.create({
	// baseURL 제거 - Orval 생성 코드가 완전한 URL 사용
	timeout: 10000, // 10초 타임아웃
	withCredentials: true, // 쿠키/인증 정보 포함
}); // Orval 생성 코드가 환경별 완전한 URL을 제공

// PersistStore 참조 (앱 초기화 시 설정)
interface PersistStoreRef {
	spaceId: string | null;
}
let persistStoreRef: PersistStoreRef | null = null;

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

// 409 에러 처리를 위한 response 인터셉터 추가
AXIOS_INSTANCE.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
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

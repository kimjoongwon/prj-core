import Axios, { type AxiosRequestConfig } from "axios";

// IDP용 Axios 인스턴스
// IDP는 인증 서비스이므로 x-space-id 헤더나 토큰 갱신 로직 불필요
export const IDP_AXIOS_INSTANCE = Axios.create({
	timeout: 10000,
	withCredentials: true,
});

// IDP base URL 설정 (앱 초기화 시 호출)
export function setIdpBaseUrl(baseUrl: string) {
	IDP_AXIOS_INSTANCE.defaults.baseURL = baseUrl;
}

export const customIdpInstance = <T>(
	config: AxiosRequestConfig,
	options?: AxiosRequestConfig,
): Promise<T> => {
	const source = Axios.CancelToken.source();
	const headers = {
		...config.headers,
		...options?.headers,
	};
	const promise = IDP_AXIOS_INSTANCE({
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

export type ErrorType<Error> = import("axios").AxiosError<Error>;

export type BodyType<BodyData> = BodyData;

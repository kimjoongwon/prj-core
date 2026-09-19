import Axios, { type AxiosRequestConfig } from "axios";

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

/**
 * IDP용 Axios 인스턴스.
 *
 * IDP 로그인 UI(idp/web)가 인증 서버의 공개 API(interaction, i18n catalog 등)를
 * 호출하는 전송 계층이다. 로그인 전 단계만 다루므로 세션 헤더 동기화, 토큰
 * 갱신, 401 복구 같은 세션 정책을 두지 않고 401을 그대로 호출자에게 돌려준다.
 * (로그인 화면에서 401은 자격 증명 불일치를 의미한다.)
 */
export const IDP_AXIOS_INSTANCE = Axios.create({
	timeout: 10000,
	withCredentials: true,
});

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

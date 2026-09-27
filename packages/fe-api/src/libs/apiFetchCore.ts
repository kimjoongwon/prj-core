import { runtimeManifest } from "./runtimeManifest";
import { transformResponseData } from "./runtimeSchema";

const REQUEST_TIMEOUT_MS = 10_000;

/** 생성 코드 mutator와 손작업 클라이언트가 공유하는 fetch 요청 옵션 타입. */
export type ApiRequestInit = RequestInit;

/**
 * API 전송 계층의 표준 에러.
 *
 * - status: HTTP 응답 상태 코드 (네트워크 실패처럼 응답이 없으면 이 에러가 아님)
 * - body: 파싱된 응답 본문 (JSON이 아니면 원문 텍스트)
 */
export class ApiClientError<TBody = unknown> extends Error {
	readonly status: number;
	readonly body: TBody;

	constructor(status: number, body: TBody, message: string) {
		super(message);
		this.name = "ApiClientError";
		this.status = status;
		this.body = body;
	}
}

export const isApiClientError = (
	error: unknown,
): error is ApiClientError<unknown> => error instanceof ApiClientError;

/**
 * bigint를 10진 문자열로 직렬화하는 JSON.stringify.
 *
 * orval fetch 생성기가 요청 본문을 `JSON.stringify(dto)`로 인라인 직렬화하면
 * bigint에서 TypeError가 발생하므로, codegen 후처리(codemod)가 생성 코드의
 * 본문 직렬화를 이 함수로 교체한다. Date는 toJSON으로 ISO 문자열이 된다.
 */
export const apiJsonStringify = (value: unknown): string =>
	JSON.stringify(value, (_key, propertyValue) =>
		typeof propertyValue === "bigint"
			? propertyValue.toString(10)
			: propertyValue,
	);

const serverApiBaseUrl = () =>
	(typeof process !== "undefined"
		? process.env.CORE_API_INTERNAL_URL
		: undefined) ?? "http://localhost:3006";

/**
 * 서버 컴포넌트/SSR에서 상대경로 요청이 core-api로 향하도록 internal URL을 붙인다.
 * 브라우저(와 window가 존재하는 RN)는 같은 origin 상대경로를 그대로 쓴다.
 */
const resolveServerBaseUrl = (url: string) => {
	if (typeof window !== "undefined" || !url.startsWith("/")) {
		return undefined;
	}
	return serverApiBaseUrl();
};

let configuredApiBaseUrl: string | undefined;

/** API 베이스 URL 수동 설정 (SSR/테스트 환경, 모바일 앱의 서버 주소). */
export function setConfiguredApiBaseUrl(baseUrl: string) {
	configuredApiBaseUrl = baseUrl;
}

const joinBaseUrl = (baseUrl: string, url: string) =>
	`${baseUrl.replace(/\/+$/, "")}${url.startsWith("/") ? url : `/${url}`}`;

const isAbsoluteUrl = (url: string) =>
	/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(url);

const resolveRequestUrl = (url: string) => {
	if (isAbsoluteUrl(url)) {
		return url;
	}
	// 서버 환경의 internal URL이 setApiBaseUrl로 지정한 값보다 우선한다
	// (axios 시절 명시 config.baseURL이 defaults를 이기던 우선순위 유지).
	const serverBaseUrl = resolveServerBaseUrl(url);
	if (serverBaseUrl) {
		return joinBaseUrl(serverBaseUrl, url);
	}
	if (configuredApiBaseUrl) {
		return joinBaseUrl(configuredApiBaseUrl, url);
	}
	return url;
};

/**
 * 호출 signal과 타임아웃을 합성한다. AbortSignal.any/timeout을 지원하지 않는
 * 런타임(RN/Hermes 구버전)에서도 동작하도록 수동 폴백을 둔다.
 *
 * dispose는 요청 완료 후 남은 타임아웃 타이머를 해제한다. 폴백 경로는
 * 완료 시점에 타이머가 아직 살아 있어 해제하지 않으면 요청당 최대
 * REQUEST_TIMEOUT_MS까지 타이머가 남는다. AbortSignal.any 경로는 네이티브
 * 구현이라 no-op다.
 */
const composeTimeoutSignal = (
	upstreamSignal: AbortSignal | null | undefined,
	timeoutMs: number,
): { signal: AbortSignal; dispose: () => void } => {
	if (
		typeof AbortSignal.any === "function" &&
		typeof AbortSignal.timeout === "function"
	) {
		return {
			signal: upstreamSignal
				? AbortSignal.any([upstreamSignal, AbortSignal.timeout(timeoutMs)])
				: AbortSignal.timeout(timeoutMs),
			dispose: () => {},
		};
	}

	const composedController = new AbortController();
	const abortWith = (reason: unknown) => {
		if (!composedController.signal.aborted) {
			composedController.abort(reason);
		}
	};
	const timeoutTimer = setTimeout(
		() => abortWith(new Error(`timeout of ${timeoutMs}ms exceeded`)),
		timeoutMs,
	);
	const stopTimeout = () => clearTimeout(timeoutTimer);
	composedController.signal.addEventListener("abort", stopTimeout, {
		once: true,
	});
	if (upstreamSignal) {
		upstreamSignal.addEventListener(
			"abort",
			() => {
				stopTimeout();
				abortWith(upstreamSignal.reason);
			},
			{ once: true },
		);
	}
	return { signal: composedController.signal, dispose: stopTimeout };
};

const isAbortFailure = (error: unknown) =>
	error instanceof DOMException ? error.name === "AbortError" : false;

const readResponseBody = async (response: Response): Promise<unknown> => {
	if (response.status === 204) {
		return undefined;
	}
	const rawBody = await response.text();
	if (!rawBody) {
		return undefined;
	}
	try {
		return JSON.parse(rawBody) as unknown;
	} catch {
		return rawBody;
	}
};

export interface ApiFetchCoreOptions {
	/**
	 * 런타임 매니페스트 기반 응답 변환(date-time→Date, bigint 복원)을 건너뛴다.
	 * 세션 정책 없는 IDP 공개 클라이언트가 원본 응답을 그대로 반환할 때 사용.
	 */
	applyRuntimeResponseTransform?: boolean;
}

/**
 * 모든 API 클라이언트가 공유하는 fetch 실행부.
 *
 * URL 해석, 타임아웃 signal 합성, credentials, 응답 본문 파싱, 표준 에러
 * 변환, 런타임 타입 응답 변환을 담당한다. 세션 헤더 주입과 401 복구는
 * 이 계층 위의 customFetch가 소유한다.
 */
export async function executeApiFetch<T>(
	url: string,
	init: ApiRequestInit,
	coreOptions: ApiFetchCoreOptions = {},
): Promise<T> {
	const requestMethod = init.method ?? "GET";
	const { signal: requestSignal, dispose } = composeTimeoutSignal(
		init.signal,
		REQUEST_TIMEOUT_MS,
	);
	try {
		const response = await fetch(resolveRequestUrl(url), {
			...init,
			credentials: "include",
			signal: requestSignal,
		});
		const responseBody = await readResponseBody(response);
		if (!response.ok) {
			throw new ApiClientError(
				response.status,
				responseBody,
				`Request failed with status code ${response.status}`,
			);
		}
		if (coreOptions.applyRuntimeResponseTransform === false) {
			return responseBody as T;
		}
		return transformResponseData(
			responseBody,
			response.status,
			requestMethod,
			url,
			runtimeManifest,
		) as T;
	} catch (fetchError) {
		// 타임아웃 중단(호출 signal이 아니라 내부 타임아웃에 의한 중단)은
		// react-query가 취소로 오인하지 않도록 일반 에러로 바꿔 던진다.
		if (isAbortFailure(fetchError) && !init.signal?.aborted) {
			throw new Error(`timeout of ${REQUEST_TIMEOUT_MS}ms exceeded`);
		}
		throw fetchError;
	} finally {
		dispose();
	}
}

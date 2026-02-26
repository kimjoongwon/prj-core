import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

interface PrefetchAIFormTemplatesParams {
	take?: number;
	skip?: number;
}

/**
 * AI 폼 템플릿 데이터 프리페칭 함수
 * SSR 시점에 데이터를 미리 조회하여 클라이언트로 전달합니다.
 *
 * TODO: API 구현 후 아래 주석 해제
 * import { prefetchGetAIFormTemplatesQuery } from "@cocrepo/api";
 * import { withServerCookies } from "@cocrepo/api/server";
 */
export async function prefetchAIFormTemplatesData(
	queryClient: QueryClient,
	_cookies: ReadonlyRequestCookies,
	_params: PrefetchAIFormTemplatesParams = {},
) {
	const { take = 20, skip = 0 } = _params;

	// TODO: API 구현 후 실제 prefetch 호출로 교체
	// await prefetchGetAIFormTemplatesQuery(
	// 	queryClient,
	// 	{ take, skip },
	// 	{
	// 		request: withServerCookies(_cookies),
	// 	},
	// );

	// 임시: prefetch 없이 진행 (API 구현 전)
	void queryClient;
	void take;
	void skip;
}

import { prefetchGetOidcSessionsQuery } from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

interface PrefetchOidcSessionsParams {
	take?: number;
	skip?: number;
	modelType?: string;
}

/**
 * OIDC 세션 목록 데이터 프리페칭 함수
 */
export async function prefetchOidcSessionsData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	params: PrefetchOidcSessionsParams = {},
) {
	const { take = 20, skip = 0, modelType } = params;

	await prefetchGetOidcSessionsQuery(
		queryClient,
		{ take, skip, modelType },
		{
			request: withServerCookies(cookies),
		},
	);
}

import { prefetchGetOidcClientsQuery } from "@cocrepo/api/idp/oidc-clients";

import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

interface PrefetchOidcClientsParams {
	take?: number;
	skip?: number;
}

/**
 * OIDC 클라이언트 목록 데이터 프리페칭 함수
 * SSR 시점에 데이터를 미리 조회하여 클라이언트로 전달합니다.
 */
export async function prefetchOidcClientsData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	params: PrefetchOidcClientsParams = {},
) {
	const { take = 20, skip = 0 } = params;

	await prefetchGetOidcClientsQuery(
		queryClient,
		{ take, skip },
		{
			request: withServerCookies(cookies),
		},
	);
}

import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

interface PrefetchUsersParams {
	page?: number;
	limit?: number;
}

/**
 * Users 데이터 프리페칭 함수 (TODO: API 구현 후 활성화)
 */
export async function prefetchUsersData(
	_queryClient: QueryClient,
	_cookies: ReadonlyRequestCookies,
	_params: PrefetchUsersParams = {},
) {
	// TODO: prefetchGetUsersQuery가 생성되면 활성화
	// const { page = 1, limit = 20 } = params;
	// await prefetchGetUsersQuery(
	// 	queryClient,
	// 	{ page, limit },
	// 	{
	// 		request: withServerCookies(cookies),
	// 	},
	// );
}

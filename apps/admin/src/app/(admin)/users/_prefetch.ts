import { prefetchGetUsersQuery } from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

interface PrefetchUsersParams {
	page?: number;
	limit?: number;
}

/**
 * Users 데이터 프리페칭 함수
 * 서버 컴포넌트에서 QueryClient에 데이터를 미리 캐싱합니다.
 */
export async function prefetchUsersData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	params: PrefetchUsersParams = {},
) {
	const { page = 1, limit = 20 } = params;

	await prefetchGetUsersQuery(queryClient, { page, limit }, {
		request: withServerCookies(cookies),
	});
}

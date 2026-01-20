import type { GetUsers200AllOf, GetUsersParams } from "@cocrepo/api";
import { customInstance } from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * Users 쿼리 키 생성 함수
 * Orval이 생성할 getGetUsersQueryKey와 동일한 패턴
 */
export function getGetUsersQueryKey(params?: GetUsersParams) {
	return [`/api/v1/users`, ...(params ? [params] : [])] as const;
}

/**
 * Users API 호출 함수
 * 서버 컴포넌트에서 프리페칭에 사용
 */
export async function getUsers(
	params?: GetUsersParams,
	options?: Parameters<typeof customInstance>[1],
): Promise<GetUsers200AllOf> {
	return customInstance<GetUsers200AllOf>(
		{
			url: `/api/v1/users`,
			method: "GET",
			params,
		},
		options,
	);
}

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
	const serverOptions = withServerCookies(cookies);
	const { page = 1, limit = 20 } = params;

	const queryParams: GetUsersParams = { page, limit };

	await queryClient.prefetchQuery({
		queryKey: getGetUsersQueryKey(queryParams),
		queryFn: () => getUsers(queryParams, serverOptions),
	});
}

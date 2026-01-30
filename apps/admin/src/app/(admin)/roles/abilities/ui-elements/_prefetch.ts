import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * UI 가시성 페이지에서 필요한 데이터를 서버 사이드에서 미리 가져옵니다.
 * (TODO: API 구현 후 활성화)
 */
export async function prefetchUIElementsData(
	_queryClient: QueryClient,
	_cookies: ReadonlyRequestCookies,
) {
	// TODO: prefetchGetRolesQuery와 prefetchGetSubjectsQuery가 생성되면 활성화
	// const requestOptions = { request: withServerCookies(cookies) };
	// await Promise.all([
	// 	prefetchGetRolesQuery(queryClient, requestOptions),
	// 	prefetchGetSubjectsQuery(queryClient, {}, requestOptions),
	// ]);
}

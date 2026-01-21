import {
	prefetchGetRolesQuery,
	prefetchGetSubjectsQuery,
} from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * UI 가시성 페이지에서 필요한 데이터를 서버 사이드에서 미리 가져옵니다.
 *
 * - Role 목록: 가시성 매트릭스의 열에 표시
 * - Subject 목록: 가시성 매트릭스의 행에 표시 (ui:xxx Subject만 필터링)
 */
export async function prefetchUIElementsData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
) {
	const requestOptions = { request: withServerCookies(cookies) };

	await Promise.all([
		prefetchGetRolesQuery(queryClient, requestOptions),
		prefetchGetSubjectsQuery(queryClient, {}, requestOptions),
	]);
}

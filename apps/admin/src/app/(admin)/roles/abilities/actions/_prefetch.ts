import { prefetchGetActionsQuery } from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * Action 관리 페이지에서 필요한 데이터를 서버 사이드에서 미리 가져옵니다.
 *
 * - Action 목록: Action 관리 테이블에 표시
 */
export async function prefetchActionsData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
) {
	const requestOptions = { request: withServerCookies(cookies) };

	await prefetchGetActionsQuery(queryClient, {}, requestOptions);
}

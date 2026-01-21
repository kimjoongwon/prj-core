import { prefetchGetSubjectsQuery } from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * Subject 관리 페이지에서 필요한 데이터를 서버 사이드에서 미리 가져옵니다.
 *
 * - Subject 목록: Subject 관리 테이블에 표시
 */
export async function prefetchSubjectsData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
) {
	const requestOptions = { request: withServerCookies(cookies) };

	await prefetchGetSubjectsQuery(queryClient, {}, requestOptions);
}

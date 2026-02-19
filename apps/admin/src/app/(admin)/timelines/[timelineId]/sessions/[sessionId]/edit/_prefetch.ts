import { prefetchGetSessionByIdQuery } from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * 세션 수정 페이지 데이터 프리페칭 함수
 */
export async function prefetchSessionEditData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	timelineId: string,
	sessionId: string,
) {
	await prefetchGetSessionByIdQuery(queryClient, timelineId, sessionId, {
		request: withServerCookies(cookies),
	});
}

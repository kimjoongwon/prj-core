import { prefetchGetSessionByIdQuery } from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * 프로그램 등록 페이지 데이터 프리페칭 함수
 * 세션명/타임라인명 표시를 위해 세션 정보를 프리페칭합니다.
 */
export async function prefetchProgramNewData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	timelineId: string,
	sessionId: string,
) {
	await prefetchGetSessionByIdQuery(queryClient, timelineId, sessionId, {
		request: withServerCookies(cookies),
	});
}

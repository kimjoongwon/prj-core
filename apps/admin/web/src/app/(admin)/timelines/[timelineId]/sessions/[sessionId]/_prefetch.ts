import {
	prefetchGetProgramsQuery,
	prefetchGetSessionByIdQuery,
} from "@cocrepo/api/core/timelines";

import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * 세션 상세 페이지 데이터 프리페칭 함수
 * 세션 정보와 프로그램 목록을 함께 프리페칭합니다.
 */
export async function prefetchSessionDetailData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	timelineId: string,
	sessionId: string,
) {
	await Promise.all([
		prefetchGetSessionByIdQuery(queryClient, timelineId, sessionId, {
			request: withServerCookies(cookies),
		}),
		prefetchGetProgramsQuery(
			queryClient,
			timelineId,
			sessionId,
			{ take: 20, skip: 0 },
			{
				request: withServerCookies(cookies),
			},
		),
	]);
}

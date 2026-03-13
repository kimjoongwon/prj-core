import {
	prefetchGetSessionsQuery,
	prefetchGetTimelineByIdQuery,
} from "@cocrepo/api/core/timelines";

import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * 타임라인 상세 데이터 프리페칭 함수
 * 타임라인 기본 정보와 세션 목록을 함께 프리페칭합니다.
 */
export async function prefetchTimelineDetailData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	timelineId: string,
) {
	await Promise.all([
		prefetchGetTimelineByIdQuery(queryClient, timelineId, {
			request: withServerCookies(cookies),
		}),
		prefetchGetSessionsQuery(
			queryClient,
			timelineId,
			{ take: 20, skip: 0 },
			{
				request: withServerCookies(cookies),
			},
		),
	]);
}

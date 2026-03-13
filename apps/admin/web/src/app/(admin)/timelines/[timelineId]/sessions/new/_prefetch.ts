import { prefetchGetTimelineByIdQuery } from "@cocrepo/api/core/timelines";

import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * 세션 등록 페이지 데이터 프리페칭 함수
 * 상위 타임라인 정보를 미리 로드합니다.
 */
export async function prefetchSessionNewData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	timelineId: string,
) {
	await prefetchGetTimelineByIdQuery(queryClient, timelineId, {
		request: withServerCookies(cookies),
	});
}

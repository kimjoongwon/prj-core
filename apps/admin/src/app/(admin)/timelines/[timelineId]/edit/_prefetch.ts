import { prefetchGetTimelineByIdQuery } from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * 타임라인 수정 페이지 데이터 프리페칭 함수
 */
export async function prefetchTimelineEditData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	timelineId: string,
) {
	await prefetchGetTimelineByIdQuery(queryClient, timelineId, {
		request: withServerCookies(cookies),
	});
}

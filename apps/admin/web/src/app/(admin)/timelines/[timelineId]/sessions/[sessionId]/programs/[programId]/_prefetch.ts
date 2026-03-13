import { prefetchGetProgramByIdQuery } from "@cocrepo/api/core/timelines";

import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * 프로그램 상세 페이지 데이터 프리페칭 함수
 */
export async function prefetchProgramDetailData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	timelineId: string,
	sessionId: string,
	programId: string,
) {
	await prefetchGetProgramByIdQuery(
		queryClient,
		timelineId,
		sessionId,
		programId,
		{
			request: withServerCookies(cookies),
		},
	);
}

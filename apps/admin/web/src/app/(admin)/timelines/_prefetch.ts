import { prefetchGetTimelinesQuery } from "@cocrepo/api/core/timelines";

import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

interface PrefetchTimelinesParams {
	take?: number;
	skip?: number;
}

/**
 * 타임라인 목록 데이터 프리페칭 함수
 */
export async function prefetchTimelinesData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	params: PrefetchTimelinesParams = {},
) {
	const { take = 20, skip = 0 } = params;

	await prefetchGetTimelinesQuery(
		queryClient,
		{ take, skip },
		{
			request: withServerCookies(cookies),
		},
	);
}

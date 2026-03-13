import { prefetchGetAuthAuditLogsQuery } from "@cocrepo/api/idp/auth";

import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

interface PrefetchAuditLogsParams {
	take?: number;
	skip?: number;
}

/**
 * AuthAuditLogs 데이터 프리페칭 함수
 */
export async function prefetchAuditLogsData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	params: PrefetchAuditLogsParams = {},
) {
	const { take = 20, skip = 0 } = params;

	await prefetchGetAuthAuditLogsQuery(
		queryClient,
		{ take, skip },
		{
			request: withServerCookies(cookies),
		},
	);
}

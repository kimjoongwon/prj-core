import { prefetchGetMySessionsQuery } from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * MySessions 데이터 프리페칭 함수
 */
export async function prefetchMySessionsData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
) {
	await prefetchGetMySessionsQuery(queryClient, {
		request: withServerCookies(cookies),
	});
}

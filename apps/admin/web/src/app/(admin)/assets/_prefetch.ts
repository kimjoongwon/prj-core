import {
	prefetchGetAssetsQuery,
	prefetchGetFoldersQuery,
	type GetAssetsParams,
} from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * Assets 목록 페이지 데이터 프리페칭
 */
export async function prefetchAssetsData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	params: GetAssetsParams,
) {
	await Promise.all([
		prefetchGetAssetsQuery(queryClient, params, {
			request: withServerCookies(cookies),
		}),
		prefetchGetFoldersQuery(queryClient, {
			request: withServerCookies(cookies),
		}),
	]);
}

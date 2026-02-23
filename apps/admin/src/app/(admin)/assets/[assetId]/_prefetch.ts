import { prefetchGetAssetByIdQuery } from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * 에셋 상세 데이터 프리페치
 */
export async function prefetchAssetDetailData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	assetId: string,
) {
	await prefetchGetAssetByIdQuery(queryClient, assetId, {
		request: withServerCookies(cookies),
	});
}

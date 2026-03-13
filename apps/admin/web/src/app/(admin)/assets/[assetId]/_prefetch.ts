import { prefetchGetAssetByIdQuery } from "@cocrepo/api/assets";

import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * Asset 상세 페이지 데이터 프리페칭
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

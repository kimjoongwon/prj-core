import { prefetchGetSpaceGroundQuery } from "@cocrepo/api/core/spaces";

import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * Space의 Ground detail 수정 데이터 프리페칭 함수
 * SSR 시점에 시설 detail 데이터를 미리 조회하여 클라이언트로 전달합니다.
 */
export async function prefetchGroundEditData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	spaceId: string,
) {
	await prefetchGetSpaceGroundQuery(queryClient, spaceId, {
		request: withServerCookies(cookies),
	});
}

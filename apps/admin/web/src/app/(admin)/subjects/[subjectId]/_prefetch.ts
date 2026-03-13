import { prefetchGetSubjectByIdQuery } from "@cocrepo/api/core/subjects";

import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * Subject 상세 데이터 프리페칭 함수
 * SSR 시점에 데이터를 미리 조회하여 클라이언트로 전달합니다.
 */
export async function prefetchSubjectDetailData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	subjectId: string,
) {
	await prefetchGetSubjectByIdQuery(queryClient, subjectId, {
		request: withServerCookies(cookies),
	});
}

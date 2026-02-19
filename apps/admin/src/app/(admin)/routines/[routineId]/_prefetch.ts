import { prefetchGetRoutineQuery } from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * Routine 상세 데이터 프리페칭 함수
 * SSR 시점에 루틴 데이터를 미리 조회하여 클라이언트로 전달합니다.
 */
export async function prefetchRoutineDetailData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	routineId: string,
) {
	await prefetchGetRoutineQuery(queryClient, routineId, {
		request: withServerCookies(cookies),
	});
}

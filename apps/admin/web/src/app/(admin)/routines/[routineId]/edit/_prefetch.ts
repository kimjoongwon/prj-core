import { prefetchGetRoutineQuery } from "@cocrepo/api/core/routines";

import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * Routine 수정 페이지 데이터 프리페칭 함수
 * SSR 시점에 기존 루틴 데이터를 미리 조회하여 클라이언트로 전달합니다.
 */
export async function prefetchRoutineEditData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	routineId: string,
) {
	await prefetchGetRoutineQuery(queryClient, routineId, {
		request: withServerCookies(cookies),
	});
}

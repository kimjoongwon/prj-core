import { prefetchGetTaskExerciseQuery } from "@cocrepo/api/core/tasks";

import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * Task의 Exercise detail 수정 데이터 프리페칭 함수
 * SSR 시점에 기존 운동 detail 데이터를 미리 조회하여 클라이언트로 전달합니다.
 */
export async function prefetchTaskExerciseEditData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	taskId: string,
) {
	await prefetchGetTaskExerciseQuery(queryClient, taskId, {
		request: withServerCookies(cookies),
	});
}

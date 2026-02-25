import { prefetchGetExerciseQuery } from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * Exercise 수정 페이지 데이터 프리페칭 함수
 * SSR 시점에 기존 운동 데이터를 미리 조회하여 클라이언트로 전달합니다.
 */
export async function prefetchExerciseEditData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
	exerciseId: string,
) {
	await prefetchGetExerciseQuery(queryClient, exerciseId, {
		request: withServerCookies(cookies),
	});
}

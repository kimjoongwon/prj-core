import {
	prefetchGetIdpDashboardStatsQuery,
	prefetchGetIdpLoginTrendQuery,
} from "@cocrepo/api";
import { withServerCookies } from "@cocrepo/api/server";
import type { QueryClient } from "@tanstack/react-query";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * 대시보드 데이터 프리페칭 함수
 * SSR 시점에 통계 및 로그인 추이 데이터를 미리 조회합니다.
 */
export async function prefetchDashboardData(
	queryClient: QueryClient,
	cookies: ReadonlyRequestCookies,
) {
	await Promise.all([
		prefetchGetIdpDashboardStatsQuery(queryClient, {
			request: withServerCookies(cookies),
		}),
		prefetchGetIdpLoginTrendQuery(queryClient, {
			request: withServerCookies(cookies),
		}),
	]);
}

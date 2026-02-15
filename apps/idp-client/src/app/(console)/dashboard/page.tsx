import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import DashboardPageClient from "./_client";
import { prefetchDashboardData } from "./_prefetch";

/**
 * IDP 대시보드 페이지 - 서버 컴포넌트
 * SSR 시점에 통계 및 로그인 추이 데이터를 프리페칭합니다.
 */
export default async function DashboardPage() {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchDashboardData(queryClient, cookieStore);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<DashboardPageClient />
		</HydrationBoundary>
	);
}

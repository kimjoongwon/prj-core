import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import RoutineDetailPageClient from "./_client";
import { prefetchRoutineDetailData } from "./_prefetch";

interface RoutineDetailPageProps {
	params: Promise<{ routineId: string }>;
}

/**
 * 루틴 상세 페이지 - 서버 컴포넌트
 * SSR 시점에 루틴 상세 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function RoutineDetailPage({
	params,
}: RoutineDetailPageProps) {
	const { routineId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchRoutineDetailData(queryClient, cookieStore, routineId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<RoutineDetailPageClient routineId={routineId} />
		</HydrationBoundary>
	);
}

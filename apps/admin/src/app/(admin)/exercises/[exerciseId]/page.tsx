import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import ExerciseDetailPageClient from "./_client";
import { prefetchExerciseDetailData } from "./_prefetch";

interface ExerciseDetailPageProps {
	params: Promise<{ exerciseId: string }>;
}

/**
 * 운동 종목 상세 페이지 - 서버 컴포넌트
 * SSR 시점에 운동 상세 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function ExerciseDetailPage({
	params,
}: ExerciseDetailPageProps) {
	const { exerciseId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchExerciseDetailData(queryClient, cookieStore, exerciseId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ExerciseDetailPageClient exerciseId={exerciseId} />
		</HydrationBoundary>
	);
}

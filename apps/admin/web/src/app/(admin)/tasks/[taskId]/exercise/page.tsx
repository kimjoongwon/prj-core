import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import TaskExerciseDetailPageClient from "./_client";
import { prefetchTaskExerciseDetailData } from "./_prefetch";

interface TaskExerciseDetailPageProps {
	params: Promise<{ taskId: string }>;
}

/**
 * 태스크의 운동 detail 페이지 - 서버 컴포넌트
 * SSR 시점에 운동 detail 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function TaskExerciseDetailPage({
	params,
}: TaskExerciseDetailPageProps) {
	const { taskId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchTaskExerciseDetailData(queryClient, cookieStore, taskId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TaskExerciseDetailPageClient taskId={taskId} />
		</HydrationBoundary>
	);
}

import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import TaskExerciseEditPageClient from "./_client";
import { prefetchTaskExerciseEditData } from "./_prefetch";

interface TaskExerciseEditPageProps {
	params: Promise<{ taskId: string }>;
}

/**
 * 태스크의 운동 detail 수정 페이지 - 서버 컴포넌트
 * SSR 시점에 기존 운동 detail 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function TaskExerciseEditPage({
	params,
}: TaskExerciseEditPageProps) {
	const { taskId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchTaskExerciseEditData(queryClient, cookieStore, taskId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TaskExerciseEditPageClient taskId={taskId} />
		</HydrationBoundary>
	);
}

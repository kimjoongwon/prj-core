import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import ExerciseEditPageClient from "./_client";
import { prefetchExerciseEditData } from "./_prefetch";

interface ExerciseEditPageProps {
	params: Promise<{ exerciseId: string }>;
}

/**
 * 운동 종목 수정 페이지 - 서버 컴포넌트
 * SSR 시점에 기존 운동 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function ExerciseEditPage({
	params,
}: ExerciseEditPageProps) {
	const { exerciseId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchExerciseEditData(queryClient, cookieStore, exerciseId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ExerciseEditPageClient exerciseId={exerciseId} />
		</HydrationBoundary>
	);
}

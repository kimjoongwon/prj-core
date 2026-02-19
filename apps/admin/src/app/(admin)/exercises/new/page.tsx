import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import ExerciseNewPageClient from "./_client";

/**
 * 운동 종목 등록 페이지 - 서버 컴포넌트
 */
export default async function ExerciseNewPage() {
	const queryClient = new QueryClient();

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ExerciseNewPageClient />
		</HydrationBoundary>
	);
}

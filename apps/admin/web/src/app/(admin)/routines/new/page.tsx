import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import RoutineNewPageClient from "./_client";

/**
 * 루틴 등록 페이지 - 서버 컴포넌트
 */
export default async function RoutineNewPage() {
	const queryClient = new QueryClient();

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<RoutineNewPageClient />
		</HydrationBoundary>
	);
}

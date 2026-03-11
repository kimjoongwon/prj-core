import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import TaskNewPageClient from "./_client";

/**
 * 태스크 등록 페이지 - 서버 컴포넌트
 */
export default async function TaskNewPage() {
	const queryClient = new QueryClient();

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TaskNewPageClient />
		</HydrationBoundary>
	);
}

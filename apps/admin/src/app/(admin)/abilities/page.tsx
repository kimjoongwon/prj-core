import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import AbilitiesPageClient from "./_client";

/**
 * 권한 목록 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function AbilitiesPage() {
	const queryClient = new QueryClient();

	// 현재 전체 목록 API가 없으므로 prefetch 없이 진행
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AbilitiesPageClient />
		</HydrationBoundary>
	);
}

import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import AbilityNewPageClient from "./_client";

/**
 * 권한 등록 페이지 - 서버 컴포넌트
 */
export default async function AbilityNewPage() {
	const queryClient = new QueryClient();

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AbilityNewPageClient />
		</HydrationBoundary>
	);
}

import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import TemplateNewPageClient from "./_client";

/**
 * 템플릿 등록 페이지 - 서버 컴포넌트
 */
export default async function TemplateNewPage() {
	const queryClient = new QueryClient();

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TemplateNewPageClient />
		</HydrationBoundary>
	);
}

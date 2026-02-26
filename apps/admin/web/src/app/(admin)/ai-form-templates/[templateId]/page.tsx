import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import AIFormTemplateDetailPageClient from "./_client";

interface AIFormTemplateDetailPageProps {
	params: Promise<{ templateId: string }>;
}

/**
 * AI 폼 템플릿 상세 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 *
 * TODO: API 구현 후 prefetch 로직 추가
 */
export default async function AIFormTemplateDetailPage({
	params,
}: AIFormTemplateDetailPageProps) {
	const { templateId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	// TODO: API 구현 후 실제 prefetch 호출로 교체
	// await prefetchAIFormTemplateDetailData(queryClient, cookieStore, templateId);

	void queryClient;
	void cookieStore;

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AIFormTemplateDetailPageClient templateId={templateId} />
		</HydrationBoundary>
	);
}

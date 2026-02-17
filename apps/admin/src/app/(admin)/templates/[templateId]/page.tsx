import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import TemplateDetailPageClient from "./_client";
import { prefetchTemplateDetailData } from "./_prefetch";

interface TemplateDetailPageProps {
	params: Promise<{ templateId: string }>;
}

/**
 * 메시지 템플릿 상세 페이지 - 서버 컴포넌트
 * SSR 시점에 템플릿 상세 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function TemplateDetailPage({
	params,
}: TemplateDetailPageProps) {
	const { templateId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchTemplateDetailData(queryClient, cookieStore, templateId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TemplateDetailPageClient templateId={templateId} />
		</HydrationBoundary>
	);
}

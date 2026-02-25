import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import TemplateEditPageClient from "./_client";
import { prefetchTemplateEditData } from "./_prefetch";

interface TemplateEditPageProps {
	params: Promise<{ templateId: string }>;
}

/**
 * 템플릿 수정 페이지 - 서버 컴포넌트
 * SSR 시점에 템플릿 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function TemplateEditPage({
	params,
}: TemplateEditPageProps) {
	const { templateId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchTemplateEditData(queryClient, cookieStore, templateId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TemplateEditPageClient templateId={templateId} />
		</HydrationBoundary>
	);
}

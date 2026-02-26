import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import InquiryDetailPageClient from "./_client";
import { prefetchInquiryDetailData } from "./_prefetch";

interface PageProps {
	params: Promise<{ inquiryId: string }>;
}

/**
 * 문의 상세 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function InquiryDetailPage({ params }: PageProps) {
	const { inquiryId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchInquiryDetailData(queryClient, cookieStore, inquiryId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<InquiryDetailPageClient inquiryId={inquiryId} />
		</HydrationBoundary>
	);
}

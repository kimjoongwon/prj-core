import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import InquiriesPageClient from "./_client";
import { prefetchInquiriesData } from "./_prefetch";

interface InquiriesPageProps {
	searchParams: Promise<{
		take?: string;
		skip?: string;
		inquiryStatus?: string;
		category?: string;
		channel?: string;
		priority?: string;
		search?: string;
	}>;
}

/**
 * 문의 목록 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function InquiriesPage({
	searchParams,
}: InquiriesPageProps) {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();
	const params = await searchParams;

	const take = Number(params.take) || 20;
	const skip = Number(params.skip) || 0;

	await prefetchInquiriesData(queryClient, cookieStore, {
		take,
		skip,
		inquiryStatus: params.inquiryStatus,
		category: params.category,
		channel: params.channel,
		priority: params.priority,
		search: params.search,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<InquiriesPageClient />
		</HydrationBoundary>
	);
}

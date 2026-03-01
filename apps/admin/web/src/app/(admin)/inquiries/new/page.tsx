import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import InquiriesNewPageClient from "./_client";
import { prefetchInquiryCreateFormData } from "./_prefetch";

/**
 * 문의 접수 페이지 - 서버 컴포넌트
 * SSR 시점에 문의 생성 폼 bootstrap을 프리페치합니다.
 */
export default async function InquiriesNewPage() {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchInquiryCreateFormData(queryClient, cookieStore);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<InquiriesNewPageClient />
		</HydrationBoundary>
	);
}

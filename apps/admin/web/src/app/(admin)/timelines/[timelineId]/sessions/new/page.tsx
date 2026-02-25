import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import SessionNewPageClient from "./_client";
import { prefetchSessionNewData } from "./_prefetch";

interface SessionNewPageProps {
	params: Promise<{ timelineId: string }>;
}

/**
 * 세션 등록 페이지 - 서버 컴포넌트
 */
export default async function SessionNewPage({ params }: SessionNewPageProps) {
	const { timelineId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchSessionNewData(queryClient, cookieStore, timelineId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<SessionNewPageClient timelineId={timelineId} />
		</HydrationBoundary>
	);
}

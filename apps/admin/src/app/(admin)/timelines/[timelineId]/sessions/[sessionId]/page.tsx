import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import SessionDetailPageClient from "./_client";
import { prefetchSessionDetailData } from "./_prefetch";

interface SessionDetailPageProps {
	params: Promise<{ timelineId: string; sessionId: string }>;
}

/**
 * 세션 상세 페이지 - 서버 컴포넌트
 */
export default async function SessionDetailPage({
	params,
}: SessionDetailPageProps) {
	const { timelineId, sessionId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchSessionDetailData(
		queryClient,
		cookieStore,
		timelineId,
		sessionId,
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<SessionDetailPageClient
				timelineId={timelineId}
				sessionId={sessionId}
			/>
		</HydrationBoundary>
	);
}

import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import TimelineDetailPageClient from "./_client";
import { prefetchTimelineDetailData } from "./_prefetch";

interface TimelineDetailPageProps {
	params: Promise<{ timelineId: string }>;
}

/**
 * 타임라인 상세 페이지 - 서버 컴포넌트
 */
export default async function TimelineDetailPage({
	params,
}: TimelineDetailPageProps) {
	const { timelineId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchTimelineDetailData(queryClient, cookieStore, timelineId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TimelineDetailPageClient timelineId={timelineId} />
		</HydrationBoundary>
	);
}

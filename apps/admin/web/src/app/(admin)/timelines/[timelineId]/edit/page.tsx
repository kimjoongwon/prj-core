import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import TimelineEditPageClient from "./_client";
import { prefetchTimelineEditData } from "./_prefetch";

interface TimelineEditPageProps {
	params: Promise<{ timelineId: string }>;
}

/**
 * 타임라인 수정 페이지 - 서버 컴포넌트
 */
export default async function TimelineEditPage({
	params,
}: TimelineEditPageProps) {
	const { timelineId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchTimelineEditData(queryClient, cookieStore, timelineId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TimelineEditPageClient timelineId={timelineId} />
		</HydrationBoundary>
	);
}

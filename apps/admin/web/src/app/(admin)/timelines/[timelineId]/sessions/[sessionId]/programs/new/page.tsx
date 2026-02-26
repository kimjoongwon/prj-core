import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import ProgramNewPageClient from "./_client";
import { prefetchProgramNewData } from "./_prefetch";

interface ProgramNewPageProps {
	params: Promise<{ timelineId: string; sessionId: string }>;
}

/**
 * 프로그램 등록 페이지 - 서버 컴포넌트
 */
export default async function ProgramNewPage({ params }: ProgramNewPageProps) {
	const { timelineId, sessionId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchProgramNewData(queryClient, cookieStore, timelineId, sessionId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProgramNewPageClient timelineId={timelineId} sessionId={sessionId} />
		</HydrationBoundary>
	);
}

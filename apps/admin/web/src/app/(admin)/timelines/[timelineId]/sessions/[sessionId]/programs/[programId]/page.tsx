import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import ProgramDetailPageClient from "./_client";
import { prefetchProgramDetailData } from "./_prefetch";

interface ProgramDetailPageProps {
	params: Promise<{
		timelineId: string;
		sessionId: string;
		programId: string;
	}>;
}

/**
 * 프로그램 상세 페이지 - 서버 컴포넌트
 */
export default async function ProgramDetailPage({
	params,
}: ProgramDetailPageProps) {
	const { timelineId, sessionId, programId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchProgramDetailData(
		queryClient,
		cookieStore,
		timelineId,
		sessionId,
		programId,
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProgramDetailPageClient
				timelineId={timelineId}
				sessionId={sessionId}
				programId={programId}
			/>
		</HydrationBoundary>
	);
}

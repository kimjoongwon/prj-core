import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import ProgramEditPageClient from "./_client";
import { prefetchProgramEditData } from "./_prefetch";

interface ProgramEditPageProps {
	params: Promise<{
		timelineId: string;
		sessionId: string;
		programId: string;
	}>;
}

/**
 * 프로그램 수정 페이지 - 서버 컴포넌트
 */
export default async function ProgramEditPage({
	params,
}: ProgramEditPageProps) {
	const { timelineId, sessionId, programId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchProgramEditData(
		queryClient,
		cookieStore,
		timelineId,
		sessionId,
		programId,
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProgramEditPageClient
				timelineId={timelineId}
				sessionId={sessionId}
				programId={programId}
			/>
		</HydrationBoundary>
	);
}

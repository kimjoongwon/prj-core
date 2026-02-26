import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import SessionEditPageClient from "./_client";
import { prefetchSessionEditData } from "./_prefetch";

interface SessionEditPageProps {
	params: Promise<{ timelineId: string; sessionId: string }>;
}

/**
 * 세션 수정 페이지 - 서버 컴포넌트
 */
export default async function SessionEditPage({
	params,
}: SessionEditPageProps) {
	const { timelineId, sessionId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchSessionEditData(
		queryClient,
		cookieStore,
		timelineId,
		sessionId,
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<SessionEditPageClient timelineId={timelineId} sessionId={sessionId} />
		</HydrationBoundary>
	);
}

import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import SubjectDetailPageClient from "./_client";
import { prefetchSubjectDetailData } from "./_prefetch";

interface SubjectDetailPageProps {
	params: Promise<{ subjectId: string }>;
}

/**
 * Subject 상세 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function SubjectDetailPage({
	params,
}: SubjectDetailPageProps) {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();
	const { subjectId } = await params;

	await prefetchSubjectDetailData(queryClient, cookieStore, subjectId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<SubjectDetailPageClient subjectId={subjectId} />
		</HydrationBoundary>
	);
}

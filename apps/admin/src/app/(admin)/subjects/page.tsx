import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import SubjectsPageClient from "./_client";
import { prefetchSubjectsData } from "./_prefetch";

/**
 * Subject 목록 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function SubjectsPage() {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchSubjectsData(queryClient, cookieStore);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<SubjectsPageClient />
		</HydrationBoundary>
	);
}

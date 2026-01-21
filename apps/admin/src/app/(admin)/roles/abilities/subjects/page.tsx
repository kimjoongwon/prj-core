import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import SubjectsPageClient from "./_client";
import { prefetchSubjectsData } from "./_prefetch";

/**
 * Subject 관리 페이지
 *
 * 서버 컴포넌트에서 필요한 데이터를 미리 가져와
 * 클라이언트에서 즉시 렌더링할 수 있도록 합니다.
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

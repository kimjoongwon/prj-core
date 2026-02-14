import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import MySessionsClient from "./_client";
import { prefetchMySessionsData } from "./_prefetch";

/**
 * 내 세션 관리 페이지 - 서버 컴포넌트
 */
export default async function MySessionsPage() {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchMySessionsData(queryClient, cookieStore);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<MySessionsClient />
		</HydrationBoundary>
	);
}

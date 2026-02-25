import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import GroundsPageClient from "./_client";
import { prefetchGroundsData } from "./_prefetch";

/**
 * 시설 목록 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function GroundsPage() {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchGroundsData(queryClient, cookieStore);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<GroundsPageClient />
		</HydrationBoundary>
	);
}

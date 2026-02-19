import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import TimelinesPageClient from "./_client";
import { prefetchTimelinesData } from "./_prefetch";

interface TimelinesPageProps {
	searchParams: Promise<{ take?: string; skip?: string }>;
}

/**
 * 타임라인 목록 페이지 - 서버 컴포넌트
 */
export default async function TimelinesPage({
	searchParams,
}: TimelinesPageProps) {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();
	const params = await searchParams;

	const take = Number(params.take) || 20;
	const skip = Number(params.skip) || 0;

	await prefetchTimelinesData(queryClient, cookieStore, { take, skip });

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TimelinesPageClient />
		</HydrationBoundary>
	);
}

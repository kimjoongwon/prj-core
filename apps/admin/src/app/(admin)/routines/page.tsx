import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import RoutinesPageClient from "./_client";
import { prefetchRoutinesData } from "./_prefetch";

interface RoutinesPageProps {
	searchParams: Promise<{ take?: string; skip?: string }>;
}

/**
 * 루틴 목록 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function RoutinesPage({
	searchParams,
}: RoutinesPageProps) {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();
	const params = await searchParams;

	const take = Number(params.take) || 20;
	const skip = Number(params.skip) || 0;

	await prefetchRoutinesData(queryClient, cookieStore, { take, skip });

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<RoutinesPageClient />
		</HydrationBoundary>
	);
}

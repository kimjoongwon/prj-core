import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import ActionsPageClient from "./_client";
import { prefetchActionsData } from "./_prefetch";

interface ActionsPageProps {
	searchParams: Promise<{ group?: string }>;
}

/**
 * Action 목록 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function ActionsPage({ searchParams }: ActionsPageProps) {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();
	const params = await searchParams;

	const group = params.group;

	await prefetchActionsData(queryClient, cookieStore, { group });

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ActionsPageClient />
		</HydrationBoundary>
	);
}

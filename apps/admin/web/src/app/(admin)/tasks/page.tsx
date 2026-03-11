import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import TasksPageClient from "./_client";
import { prefetchTasksData } from "./_prefetch";

interface TasksPageProps {
	searchParams: Promise<{ take?: string; skip?: string }>;
}

/**
 * 태스크 목록 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function TasksPage({ searchParams }: TasksPageProps) {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();
	const params = await searchParams;

	const take = Number(params.take) || 20;
	const skip = Number(params.skip) || 0;

	await prefetchTasksData(queryClient, cookieStore, { take, skip });

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TasksPageClient />
		</HydrationBoundary>
	);
}

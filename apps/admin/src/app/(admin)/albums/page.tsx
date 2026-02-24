import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import AlbumsPageClient from "./_client";
import { prefetchAlbumsData } from "./_prefetch";

interface AlbumsPageProps {
	searchParams: Promise<{ take?: string; skip?: string; name?: string }>;
}

/**
 * 앨범 목록 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function AlbumsPage({ searchParams }: AlbumsPageProps) {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();
	const params = await searchParams;

	const take = Number(params.take) || 50;
	const skip = Number(params.skip) || 0;
	const name = params.name;

	await prefetchAlbumsData(queryClient, cookieStore, { take, skip, name });

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AlbumsPageClient />
		</HydrationBoundary>
	);
}

import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import AssetsPageClient from "./_client";
import { prefetchAssetsData } from "./_prefetch";

interface AssetsPageProps {
	searchParams: Promise<{ take?: string; skip?: string; folderId?: string; kind?: string; search?: string }>;
}

/**
 * 에셋 목록 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function AssetsPage({ searchParams }: AssetsPageProps) {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();
	const params = await searchParams;

	const take = Number(params.take) || 20;
	const skip = Number(params.skip) || 0;
	const folderId = params.folderId;
	const kind = params.kind as "IMAGE" | "VIDEO" | "DOCUMENT" | undefined;
	const search = params.search;

	await prefetchAssetsData(queryClient, cookieStore, { take, skip, folderId, kind, search });

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AssetsPageClient />
		</HydrationBoundary>
	);
}

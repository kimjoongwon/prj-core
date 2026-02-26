import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import type { AssetKind, AssetStatus } from "@cocrepo/api";
import AssetsPageClient from "./_client";
import { prefetchAssetsData } from "./_prefetch";

interface AssetsPageProps {
	searchParams: Promise<{
		take?: string;
		skip?: string;
		search?: string;
		kind?: string;
		status?: string;
		folderId?: string;
	}>;
}

/**
 * 에셋 목록 페이지 - 서버 컴포넌트
 * TODO: Orval codegen 후 prefetchGetAssetsQuery/prefetchGetFoldersQuery로 교체
 */
export default async function AssetsPage({ searchParams }: AssetsPageProps) {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();
	const params = await searchParams;

	const take = Number(params.take) || 20;
	const skip = Number(params.skip) || 0;
	const search = params.search || undefined;
	const kind = (params.kind || undefined) as AssetKind | undefined;
	const status = (params.status || undefined) as AssetStatus | undefined;
	const folderId = params.folderId || undefined;

	await prefetchAssetsData(queryClient, cookieStore, {
		take,
		skip,
		search,
		kind,
		status,
		folderId,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AssetsPageClient />
		</HydrationBoundary>
	);
}

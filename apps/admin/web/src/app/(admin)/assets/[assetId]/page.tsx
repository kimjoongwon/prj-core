import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import AssetDetailPageClient from "./_client";
import { prefetchAssetDetailData } from "./_prefetch";

interface AssetDetailPageProps {
	params: Promise<{ assetId: string }>;
}

/**
 * 에셋 상세 페이지 - 서버 컴포넌트
 */
export default async function AssetDetailPage({
	params,
}: AssetDetailPageProps) {
	const { assetId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchAssetDetailData(queryClient, cookieStore, assetId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AssetDetailPageClient assetId={assetId} />
		</HydrationBoundary>
	);
}

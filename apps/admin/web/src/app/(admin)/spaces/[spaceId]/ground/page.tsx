import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import GroundDetailPageClient from "./_client";
import { prefetchGroundDetailData } from "./_prefetch";

interface GroundDetailPageProps {
	params: Promise<{ spaceId: string }>;
}

/**
 * 공간의 시설 detail 페이지 - 서버 컴포넌트
 * SSR 시점에 시설 detail 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function GroundDetailPage({
	params,
}: GroundDetailPageProps) {
	const { spaceId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchGroundDetailData(queryClient, cookieStore, spaceId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<GroundDetailPageClient spaceId={spaceId} />
		</HydrationBoundary>
	);
}

import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import AlbumDetailPageClient from "./_client";
import { prefetchAlbumDetailData } from "./_prefetch";

interface AlbumDetailPageProps {
	params: Promise<{ albumId: string }>;
}

/**
 * 앨범 상세 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function AlbumDetailPage({
	params,
}: AlbumDetailPageProps) {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();
	const { albumId } = await params;

	if (!albumId) {
		notFound();
	}

	await prefetchAlbumDetailData(queryClient, cookieStore, albumId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AlbumDetailPageClient albumId={albumId} />
		</HydrationBoundary>
	);
}

import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import GroundEditPageClient from "./_client";
import { prefetchGroundEditData } from "./_prefetch";

interface GroundEditPageProps {
	params: Promise<{ spaceId: string }>;
}

/**
 * 공간의 시설 detail 수정 페이지 - 서버 컴포넌트
 * SSR 시점에 시설 detail 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function GroundEditPage({ params }: GroundEditPageProps) {
	const { spaceId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchGroundEditData(queryClient, cookieStore, spaceId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<GroundEditPageClient spaceId={spaceId} />
		</HydrationBoundary>
	);
}

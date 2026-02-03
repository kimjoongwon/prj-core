import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import RoleDetailPageClient from "./_client";
import { prefetchRoleDetailData } from "./_prefetch";

interface RoleDetailPageProps {
	params: Promise<{ id: string }>;
}

/**
 * 역할 상세 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function RoleDetailPage({ params }: RoleDetailPageProps) {
	const { id } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchRoleDetailData(queryClient, cookieStore, id);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<RoleDetailPageClient id={id} />
		</HydrationBoundary>
	);
}

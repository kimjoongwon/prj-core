import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import AccountDetailPageClient from "./_client";
import { prefetchAccountDetailData } from "./_prefetch";

interface AccountDetailPageProps {
	params: Promise<{ userId: string }>;
}

/**
 * IDP 계정 상세 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function AccountDetailPage({
	params,
}: AccountDetailPageProps) {
	const { userId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchAccountDetailData(queryClient, cookieStore, userId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AccountDetailPageClient userId={userId} />
		</HydrationBoundary>
	);
}

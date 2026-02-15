import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import AccountsPageClient from "./_client";
import { prefetchAccountsData } from "./_prefetch";

interface AccountsPageProps {
	searchParams: Promise<{ take?: string; skip?: string }>;
}

/**
 * IDP 계정 관리 목록 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function AccountsPage({
	searchParams,
}: AccountsPageProps) {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();
	const params = await searchParams;

	const take = Number(params.take) || 20;
	const skip = Number(params.skip) || 0;

	await prefetchAccountsData(queryClient, cookieStore, { take, skip });

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AccountsPageClient />
		</HydrationBoundary>
	);
}

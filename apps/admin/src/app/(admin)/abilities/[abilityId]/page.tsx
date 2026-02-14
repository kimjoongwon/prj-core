import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import AbilityDetailPageClient from "./_client";
import { prefetchAbilityDetailData } from "./_prefetch";

interface AbilityDetailPageProps {
	params: Promise<{ abilityId: string }>;
}

/**
 * 권한 상세 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function AbilityDetailPage({
	params,
}: AbilityDetailPageProps) {
	const { abilityId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchAbilityDetailData(queryClient, cookieStore, abilityId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AbilityDetailPageClient abilityId={abilityId} />
		</HydrationBoundary>
	);
}

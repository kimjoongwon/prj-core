import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import AbilityEditPageClient from "./_client";
import { prefetchAbilityEditData } from "./_prefetch";

interface AbilityEditPageProps {
	params: Promise<{ abilityId: string }>;
}

/**
 * 권한 수정 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function AbilityEditPage({
	params,
}: AbilityEditPageProps) {
	const { abilityId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchAbilityEditData(queryClient, cookieStore, abilityId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AbilityEditPageClient abilityId={abilityId} />
		</HydrationBoundary>
	);
}

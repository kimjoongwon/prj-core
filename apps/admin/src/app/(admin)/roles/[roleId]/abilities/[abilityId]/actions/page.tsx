import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import AbilityActionsPageClient from "./_client";

interface AbilityActionsPageProps {
	params: Promise<{ roleId: string; abilityId: string }>;
}

/**
 * Ability Action 관리 페이지 - 서버 컴포넌트
 */
export default async function AbilityActionsPage({
	params,
}: AbilityActionsPageProps) {
	const { roleId, abilityId } = await params;
	const queryClient = new QueryClient();

	// TODO: prefetch ability data

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AbilityActionsPageClient roleId={roleId} abilityId={abilityId} />
		</HydrationBoundary>
	);
}

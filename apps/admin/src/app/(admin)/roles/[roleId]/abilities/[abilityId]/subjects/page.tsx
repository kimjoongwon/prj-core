import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import AbilitySubjectsPageClient from "./_client";

interface AbilitySubjectsPageProps {
	params: Promise<{ roleId: string; abilityId: string }>;
}

/**
 * Ability Subject 관리 페이지 - 서버 컴포넌트
 */
export default async function AbilitySubjectsPage({
	params,
}: AbilitySubjectsPageProps) {
	const { roleId, abilityId } = await params;
	const queryClient = new QueryClient();

	// TODO: prefetch ability data

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AbilitySubjectsPageClient roleId={roleId} abilityId={abilityId} />
		</HydrationBoundary>
	);
}

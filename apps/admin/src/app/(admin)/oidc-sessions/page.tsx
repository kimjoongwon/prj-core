import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import OidcSessionsPageClient from "./_client";
import { prefetchOidcSessionsData } from "./_prefetch";

interface OidcSessionsPageProps {
	searchParams: Promise<{
		take?: string;
		skip?: string;
		modelType?: string;
	}>;
}

/**
 * OIDC 세션 목록 페이지 - 서버 컴포넌트
 */
export default async function OidcSessionsPage({
	searchParams,
}: OidcSessionsPageProps) {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();
	const params = await searchParams;

	const take = Number(params.take) || 20;
	const skip = Number(params.skip) || 0;

	await prefetchOidcSessionsData(queryClient, cookieStore, {
		take,
		skip,
		modelType: params.modelType,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<OidcSessionsPageClient />
		</HydrationBoundary>
	);
}

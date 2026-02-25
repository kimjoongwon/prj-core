import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import OidcClientDetailPageClient from "./_client";
import { prefetchOidcClientDetailData } from "./_prefetch";

interface OidcClientDetailPageProps {
	params: Promise<{ oidcClientId: string }>;
}

/**
 * OIDC 클라이언트 상세 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function OidcClientDetailPage({
	params,
}: OidcClientDetailPageProps) {
	const { oidcClientId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchOidcClientDetailData(queryClient, cookieStore, oidcClientId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<OidcClientDetailPageClient oidcClientId={oidcClientId} />
		</HydrationBoundary>
	);
}

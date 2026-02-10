import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import OidcClientEditPageClient from "./_client";
import { prefetchOidcClientEditData } from "./_prefetch";

interface OidcClientEditPageProps {
	params: Promise<{ oidcClientId: string }>;
}

/**
 * OIDC 클라이언트 수정 페이지 - 서버 컴포넌트
 */
export default async function OidcClientEditPage({
	params,
}: OidcClientEditPageProps) {
	const { oidcClientId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchOidcClientEditData(queryClient, cookieStore, oidcClientId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<OidcClientEditPageClient oidcClientId={oidcClientId} />
		</HydrationBoundary>
	);
}

import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import SecurityPolicyPageClient from "./_client";
import { prefetchSecurityPolicyData } from "./_prefetch";

/**
 * 보안 정책 페이지 - 서버 컴포넌트
 * SSR 시점에 보안 정책 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function SecurityPolicyPage() {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchSecurityPolicyData(queryClient, cookieStore);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<SecurityPolicyPageClient />
		</HydrationBoundary>
	);
}

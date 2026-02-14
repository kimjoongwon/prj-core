import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import AuthAuditLogsClient from "./_client";
import { prefetchAuditLogsData } from "./_prefetch";

interface AuthAuditLogsPageProps {
	searchParams: Promise<{ take?: string; skip?: string }>;
}

/**
 * 감사 로그 페이지 - 서버 컴포넌트
 */
export default async function AuthAuditLogsPage({
	searchParams,
}: AuthAuditLogsPageProps) {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();
	const params = await searchParams;

	const take = Number(params.take) || 20;
	const skip = Number(params.skip) || 0;

	await prefetchAuditLogsData(queryClient, cookieStore, { take, skip });

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AuthAuditLogsClient />
		</HydrationBoundary>
	);
}

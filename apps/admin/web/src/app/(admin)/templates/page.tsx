import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import TemplatesPageClient from "./_client";
import { prefetchTemplatesData } from "./_prefetch";

interface TemplatesPageProps {
	searchParams: Promise<{ take?: string; skip?: string }>;
}

/**
 * 메시지 템플릿 목록 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function TemplatesPage({
	searchParams,
}: TemplatesPageProps) {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();
	const params = await searchParams;

	const take = Number(params.take) || 20;
	const skip = Number(params.skip) || 0;

	await prefetchTemplatesData(queryClient, cookieStore, { take, skip });

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TemplatesPageClient />
		</HydrationBoundary>
	);
}

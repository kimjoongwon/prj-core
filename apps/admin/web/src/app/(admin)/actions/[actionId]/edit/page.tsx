import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import ActionEditPageClient from "./_client";
import { prefetchActionEditData } from "./_prefetch";

interface ActionEditPageProps {
	params: Promise<{ actionId: string }>;
}

/**
 * Action 수정 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function ActionEditPage({ params }: ActionEditPageProps) {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();
	const { actionId } = await params;

	await prefetchActionEditData(queryClient, cookieStore, actionId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ActionEditPageClient actionId={actionId} />
		</HydrationBoundary>
	);
}

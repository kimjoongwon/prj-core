import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import RoutineEditPageClient from "./_client";
import { prefetchRoutineEditData } from "./_prefetch";

interface RoutineEditPageProps {
	params: Promise<{ routineId: string }>;
}

/**
 * 루틴 수정 페이지 - 서버 컴포넌트
 * SSR 시점에 기존 루틴 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function RoutineEditPage({
	params,
}: RoutineEditPageProps) {
	const { routineId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchRoutineEditData(queryClient, cookieStore, routineId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<RoutineEditPageClient routineId={routineId} />
		</HydrationBoundary>
	);
}

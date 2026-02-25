import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import { prefetchRoleDetailData } from "../_prefetch";
import RoleEditPageClient from "./_client";

interface RoleEditPageProps {
	params: Promise<{ roleId: string }>;
}

/**
 * 역할 수정 페이지 - 서버 컴포넌트
 * SSR 시점에 데이터를 프리페칭하여 클라이언트에 전달합니다.
 */
export default async function RoleEditPage({ params }: RoleEditPageProps) {
	const { roleId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchRoleDetailData(queryClient, cookieStore, roleId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<RoleEditPageClient roleId={roleId} />
		</HydrationBoundary>
	);
}

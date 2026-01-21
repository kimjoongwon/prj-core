import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import UserAbilitiesPageClient from "./_client";
import { prefetchUserAbilitiesData } from "./_prefetch";

/**
 * User 예외 권한 관리 페이지
 *
 * 서버 컴포넌트에서 필요한 데이터를 미리 가져와
 * 클라이언트에서 즉시 렌더링할 수 있도록 합니다.
 */
export default async function UserAbilitiesPage() {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchUserAbilitiesData(queryClient, cookieStore);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<UserAbilitiesPageClient />
		</HydrationBoundary>
	);
}

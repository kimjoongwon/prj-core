import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { cookies } from "next/headers";
import AssetUploadPageClient from "./_client";

/**
 * 에셋 업로드 페이지 - 서버 컴포넌트
 * SSR 시점에 필요한 초기 데이터를 프리페칭합니다.
 */
export default async function AssetUploadPage() {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	// 업로드 페이지는 폴더 선택을 위한 폴더 목록만 필요
	// 현재는 프리페치 없이 클라이언트에서 처리

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AssetUploadPageClient />
		</HydrationBoundary>
	);
}

import RoleCategoryDetailPageClient from "./_client";

interface RoleCategoryDetailPageProps {
	params: Promise<{ categoryId: string }>;
}

/**
 * 역할 카테고리 상세 페이지 - 서버 컴포넌트
 * TODO: Orval codegen 후 prefetch + HydrationBoundary 추가
 */
export default async function RoleCategoryDetailPage({
	params,
}: RoleCategoryDetailPageProps) {
	const { categoryId } = await params;

	return <RoleCategoryDetailPageClient categoryId={categoryId} />;
}

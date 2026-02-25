import RoleCategoryEditPageClient from "./_client";

interface RoleCategoryEditPageProps {
	params: Promise<{ categoryId: string }>;
}

/**
 * 역할 카테고리 수정 페이지 - 서버 컴포넌트
 * TODO: Orval codegen 후 prefetch + HydrationBoundary 추가
 */
export default async function RoleCategoryEditPage({
	params,
}: RoleCategoryEditPageProps) {
	const { categoryId } = await params;

	return <RoleCategoryEditPageClient categoryId={categoryId} />;
}

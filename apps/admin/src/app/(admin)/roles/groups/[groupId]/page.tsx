import RoleGroupDetailPageClient from "./_client";

interface RoleGroupDetailPageProps {
	params: Promise<{ groupId: string }>;
}

/**
 * 역할 그룹 상세 페이지 - 서버 컴포넌트
 * TODO: Orval codegen 후 prefetch + HydrationBoundary 추가
 */
export default async function RoleGroupDetailPage({
	params,
}: RoleGroupDetailPageProps) {
	const { groupId } = await params;

	return <RoleGroupDetailPageClient groupId={groupId} />;
}

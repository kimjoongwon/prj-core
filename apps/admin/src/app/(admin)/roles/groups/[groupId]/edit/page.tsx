import RoleGroupEditPageClient from "./_client";

interface RoleGroupEditPageProps {
	params: Promise<{ groupId: string }>;
}

/**
 * 역할 그룹 수정 페이지 - 서버 컴포넌트
 * TODO: Orval codegen 후 prefetch + HydrationBoundary 추가
 */
export default async function RoleGroupEditPage({
	params,
}: RoleGroupEditPageProps) {
	const { groupId } = await params;

	return <RoleGroupEditPageClient groupId={groupId} />;
}

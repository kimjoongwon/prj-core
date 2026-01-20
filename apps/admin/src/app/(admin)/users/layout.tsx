/**
 * 회원 관리 레이아웃
 *
 * PageSurface는 각 Page 컴포넌트에서 담당합니다.
 * Layout은 구조적 래핑만 수행합니다.
 */
export default function UsersLayout({
	children,
}: { children: React.ReactNode }) {
	return <>{children}</>;
}

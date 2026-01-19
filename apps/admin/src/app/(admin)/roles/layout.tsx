import type { ReactNode } from "react";

/**
 * 역할 관리 레이아웃
 *
 * Parallel Routes를 사용하여 모달을 children 위에 오버레이합니다.
 * - children: 역할 목록 페이지 (/roles)
 * - modal: 역할 추가/수정 모달 (/roles/new, /roles/[id]/edit)
 */
export default function RolesLayout({
	children,
	modal,
}: {
	children: ReactNode;
	modal: ReactNode;
}) {
	return (
		<>
			{children}
			{modal}
		</>
	);
}

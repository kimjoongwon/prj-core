"use client";

import { PageSurface } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { usePathname } from "next/navigation";

/**
 * 회원 관리 레이아웃
 *
 * - PageSurface로 전체 감싸기 (elevation: raised)
 * - 상세/수정/등록 페이지는 별도 처리
 */
function UsersLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	// 상세/수정/등록 페이지는 PageSurface 없이 children만 렌더링
	if (pathname.includes("/users/new") || pathname.match(/\/users\/[^/]+$/)) {
		return <>{children}</>;
	}

	return (
		<PageSurface
			title="회원 목록"
			description="시스템에 등록된 회원을 관리합니다."
		>
			{children}
		</PageSurface>
	);
}

export default observer(UsersLayout);

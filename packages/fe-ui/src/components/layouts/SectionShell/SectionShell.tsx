import type { ReactNode } from "react";

export interface SectionShellProps {
	/** 상단 영역 */
	top?: ReactNode;
	/** 하단 영역 */
	bottom?: ReactNode;
	/** 좌측 영역 */
	left?: ReactNode;
	/** 우측 영역 */
	right?: ReactNode;
	/** 메인 콘텐츠 (left/right만 사용 시 생략 가능) */
	children?: ReactNode;
}

/**
 * SectionShell 컴포넌트
 * 페이지 내부 구역을 정의하는 순수 레이아웃 컴포넌트 (위치 속성)
 * app/(admin)/users/layout.tsx 등에서 사용
 *
 * 구조:
 * - top: 상단 영역 (Tabs, Breadcrumb 등)
 * - left: 좌측 영역
 * - right: 우측 영역 (Detail Panel 등)
 * - bottom: 하단 영역 (Pagination 등)
 * - children: 메인 콘텐츠 영역
 *
 * @example
 * ```tsx
 * // app/(admin)/users/layout.tsx
 * export default function UsersLayout({ children }) {
 *   return (
 *     <SectionShell top={<Tabs />} bottom={<Pagination />}>
 *       {children}
 *     </SectionShell>
 *   );
 * }
 * ```
 */
export const SectionShell = ({
	top,
	bottom,
	left,
	right,
	children,
}: SectionShellProps) => {
	return (
		<div className="flex h-full flex-col">
			{top && <div className="flex-shrink-0">{top}</div>}
			<div className="flex flex-1 overflow-hidden">
				{left && <div className="flex-shrink-0">{left}</div>}
				<div className="flex-1 overflow-auto">{children}</div>
				{right && <div className="flex-shrink-0">{right}</div>}
			</div>
			{bottom && <div className="flex-shrink-0">{bottom}</div>}
		</div>
	);
};

SectionShell.displayName = "SectionShell";

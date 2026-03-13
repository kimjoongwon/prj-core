import type { ReactNode } from "react";

export interface SectionProps {
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
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * Section 컴포넌트
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
 *     <Section top={<Tabs />} bottom={<Pagination />}>
 *       {children}
 *     </Section>
 *   );
 * }
 * ```
 */
export const Section = ({
	top,
	bottom,
	left,
	right,
	children,
	className,
}: SectionProps) => {
	return (
		<section
			className={`flex w-full flex-col gap-4${className ? ` ${className}` : ""}`}
		>
			{top && <div>{top}</div>}
			<div className="flex w-full gap-4">
				{left && <div>{left}</div>}
				{children && <div className="min-w-0 flex-1">{children}</div>}
				{right && <div>{right}</div>}
			</div>
			{bottom && <div>{bottom}</div>}
		</section>
	);
};

Section.displayName = "Section";

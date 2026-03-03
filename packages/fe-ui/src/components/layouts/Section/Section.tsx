import type { ReactNode } from "react";

export type SectionMode = "shell" | "content";

export interface SectionProps {
	/** 렌더링 모드 (shell: 레이아웃, content: 콘텐츠 구역) */
	mode?: SectionMode;
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
	mode = "shell",
	top,
	bottom,
	left,
	right,
	children,
	className,
}: SectionProps) => {
	if (mode === "content") {
		return (
			<section className={`flex w-full flex-col gap-4${className ? ` ${className}` : ""}`}>
				{top && <div>{top}</div>}
				{children && <div>{children}</div>}
				{bottom && <div>{bottom}</div>}
			</section>
		);
	}

	return (
		<div className={`flex h-full flex-col${className ? ` ${className}` : ""}`}>
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

Section.displayName = "Section";

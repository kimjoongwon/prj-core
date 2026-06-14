import type { ReactNode } from "react";
import { Surface, type SurfaceProps } from "../Surface";

export type SectionSurfaceProps = SurfaceProps & {
	/** 섹션 상단 슬롯 */
	top?: ReactNode;
	/** 섹션 하단 슬롯 */
	bottom?: ReactNode;
	/** 섹션 좌측 슬롯 */
	left?: ReactNode;
	/** 섹션 우측 슬롯 */
	right?: ReactNode;
};

/**
 * SectionSurface 컴포넌트
 * screen component가 소유하는 주요 섹션 표면을 제공합니다.
 * 제목/보조 슬롯 배치는 SectionSurface가 직접 담당합니다.
 */
export const SectionSurface = ({
	children,
	className,
	variant = "secondary",
	top,
	bottom,
	left,
	right,
	...props
}: SectionSurfaceProps) => {
	const hasSectionSlots = Boolean(top || bottom || left || right);

	return (
		<Surface className={className} variant={variant} {...props}>
			{hasSectionSlots ? (
				<div className="flex w-full flex-col gap-4">
					{top && <div>{top}</div>}
					<div className="flex w-full gap-4">
						{left && <div>{left}</div>}
						{children && <div className="min-w-0 flex-1">{children}</div>}
						{right && <div>{right}</div>}
					</div>
					{bottom && <div>{bottom}</div>}
				</div>
			) : (
				children
			)}
		</Surface>
	);
};

SectionSurface.displayName = "SectionSurface";

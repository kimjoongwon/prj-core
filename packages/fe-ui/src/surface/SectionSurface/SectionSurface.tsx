import { Surface, type SurfaceProps } from "../Surface";

export type SectionSurfaceProps = SurfaceProps;

/**
 * SectionSurface 컴포넌트
 * layout/Section을 감싸는 section-level 표면입니다.
 * Header/Body/Footer 같은 구조 슬롯은 layout/Section이 계속 소유합니다.
 */
export const SectionSurface = ({
	children,
	className,
	variant = "secondary",
	...props
}: SectionSurfaceProps) => {
	return (
		<Surface className={className} variant={variant} {...props}>
			{children}
		</Surface>
	);
};

SectionSurface.displayName = "SectionSurface";

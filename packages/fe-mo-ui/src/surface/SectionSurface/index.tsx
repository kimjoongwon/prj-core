import { Surface, type SurfaceProps } from "../Surface";

export type SectionSurfaceProps = SurfaceProps;

/**
 * layout section을 감싸는 section-level 표면입니다.
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

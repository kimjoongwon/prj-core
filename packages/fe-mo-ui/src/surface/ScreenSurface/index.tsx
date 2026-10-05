import { Surface, type SurfaceProps } from "../Surface";

export type ScreenSurfaceProps = SurfaceProps;

/**
 * screen public boundary가 소유하는 화면 본문 표면을 제공합니다.
 */
export const ScreenSurface = ({
	children,
	className,
	variant = "default",
	...props
}: ScreenSurfaceProps) => {
	return (
		<Surface className={className} variant={variant} {...props}>
			{children}
		</Surface>
	);
};

ScreenSurface.displayName = "ScreenSurface";

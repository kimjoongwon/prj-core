import { Surface, type SurfaceProps } from "../Surface";

export type ScreenSurfaceProps = SurfaceProps;

/**
 * ScreenSurface 컴포넌트
 * screen public boundary가 소유하는 화면 본문 표면을 제공합니다.
 * 구조와 제목 슬롯은 `Screen`, `PageTitleBar`가 계속 담당합니다.
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

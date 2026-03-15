import type { ElevationLevel } from "../../design-system/theme/tokens";
import { Surface, type SurfacePadding, type SurfaceProps } from "../Surface";

export interface PageSurfaceProps
	extends Pick<SurfaceProps, "children" | "className"> {
	/** 페이지 표면 엘리베이션 */
	elevation?: ElevationLevel;
	/** 페이지 표면 패딩 */
	padding?: SurfacePadding;
}

/**
 * PageSurface 컴포넌트
 * 페이지 콘텐츠가 올라갈 raised 표면만 제공합니다.
 * 구조와 제목 슬롯은 `Page`, `PageTitleBar`가 계속 담당합니다.
 */
export const PageSurface = ({
	children,
	className,
	elevation = "raised",
	padding = "md",
}: PageSurfaceProps) => {
	return (
		<Surface className={className} elevation={elevation} padding={padding}>
			{children}
		</Surface>
	);
};

PageSurface.displayName = "PageSurface";

import {
	DEFAULT_SURFACE_PADDING,
	Surface,
	type ElevationLevel,
	type SurfacePadding,
	type SurfaceProps,
} from "../Surface";

export interface SectionSurfaceProps
	extends Pick<SurfaceProps, "children" | "className"> {
	/** 섹션 표면 엘리베이션 */
	elevation?: ElevationLevel;
	/** 섹션 표면 패딩 */
	padding?: SurfacePadding;
}

/**
 * SectionSurface 컴포넌트
 * 섹션 콘텐츠가 올라갈 elevated 표면만 제공합니다.
 * 구조 배치와 제목 슬롯은 `Section`, `PageTitleBar`가 계속 담당합니다.
 */
export const SectionSurface = ({
	children,
	className,
	elevation = "elevated",
	padding = DEFAULT_SURFACE_PADDING,
}: SectionSurfaceProps) => {
	return (
		<Surface className={className} elevation={elevation} padding={padding}>
			{children}
		</Surface>
	);
};

SectionSurface.displayName = "SectionSurface";

import type { ReactNode } from "react";
import {
	DEFAULT_SURFACE_PADDING,
	Surface,
	type ElevationLevel,
	type SurfacePadding,
} from "../../surface/Surface";

export interface DetailPageSurfaceProps {
	children?: ReactNode;
	className?: string;
	elevation?: ElevationLevel;
	padding?: SurfacePadding;
}

export function DetailPageSurface({
	children,
	className,
	elevation = "raised",
	padding = DEFAULT_SURFACE_PADDING,
}: DetailPageSurfaceProps) {
	return (
		<Surface className={className} elevation={elevation} padding={padding}>
			{children}
		</Surface>
	);
}

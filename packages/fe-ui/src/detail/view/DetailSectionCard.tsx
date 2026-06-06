import type { ReactNode } from "react";
import {
	DEFAULT_SURFACE_PADDING,
	Surface,
	type ElevationLevel,
	type SurfacePadding,
} from "../../surface/Surface";

export interface DetailSectionCardProps {
	children?: ReactNode;
	className?: string;
	elevation?: ElevationLevel;
	padding?: SurfacePadding;
}

export function DetailSectionCard({
	children,
	className,
	elevation = "elevated",
	padding = DEFAULT_SURFACE_PADDING,
}: DetailSectionCardProps) {
	return (
		<Surface className={className} elevation={elevation} padding={padding}>
			{children}
		</Surface>
	);
}

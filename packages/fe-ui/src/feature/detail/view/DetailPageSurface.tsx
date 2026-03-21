import type { ComponentProps } from "react";
import { PageSurface } from "../../../surface/PageSurface/PageSurface";

export type DetailPageSurfaceProps = ComponentProps<typeof PageSurface>;

export function DetailPageSurface(props: DetailPageSurfaceProps) {
	return <PageSurface {...props} />;
}

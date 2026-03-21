import type { ComponentProps } from "react";
import { PageSurface } from "../../surface/PageSurface/PageSurface";

export type FormPageSurfaceProps = ComponentProps<typeof PageSurface>;

export function FormPageSurface(props: FormPageSurfaceProps) {
	return <PageSurface {...props} />;
}

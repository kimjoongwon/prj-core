import type { ComponentProps } from "react";
import { SectionSurface } from "../../../surface/SectionSurface/SectionSurface";

export type DetailSectionCardProps = ComponentProps<typeof SectionSurface>;

export function DetailSectionCard(props: DetailSectionCardProps) {
	return <SectionSurface {...props} />;
}

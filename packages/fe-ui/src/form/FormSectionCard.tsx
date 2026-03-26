import type { ComponentProps } from "react";
import { SectionSurface } from "../surface/SectionSurface/SectionSurface";

export type FormSectionCardProps = ComponentProps<typeof SectionSurface>;

export function FormSectionCard(props: FormSectionCardProps) {
	return <SectionSurface {...props} />;
}

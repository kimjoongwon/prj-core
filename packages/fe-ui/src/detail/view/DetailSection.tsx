import type { ComponentProps } from "react";
import { Section } from "../../layout/Section/Section";

export type DetailSectionProps = ComponentProps<typeof Section>;

export function DetailSection(props: DetailSectionProps) {
	return <Section {...props} />;
}

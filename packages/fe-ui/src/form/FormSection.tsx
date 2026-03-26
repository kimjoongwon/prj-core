import type { ComponentProps } from "react";
import { Section } from "../layout/Section/Section";

export type FormSectionProps = ComponentProps<typeof Section>;

export function FormSection(props: FormSectionProps) {
	return <Section {...props} />;
}

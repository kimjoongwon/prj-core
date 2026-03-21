import type { ComponentProps } from "react";
import { Page } from "../../layout/Page/Page";

export type FormPageProps = ComponentProps<typeof Page>;

export function FormPage(props: FormPageProps) {
	return <Page {...props} />;
}

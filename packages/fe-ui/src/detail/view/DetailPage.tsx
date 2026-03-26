import type { ComponentProps } from "react";
import { Page } from "../../layout/Page/Page";

export type DetailPageProps = ComponentProps<typeof Page>;

export function DetailPage(props: DetailPageProps) {
	return <Page {...props} />;
}

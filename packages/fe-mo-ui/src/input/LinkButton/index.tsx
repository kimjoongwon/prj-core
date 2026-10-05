"use client";

import { observer } from "mobx-react-lite";
import {
	type LinkButtonProps,
	linkButtonClassNames,
	LinkButton as PureLinkButton,
} from "./LinkButton";

const LinkButton = observer((props: LinkButtonProps) => {
	return <PureLinkButton {...props} />;
});

const LinkButtonWithStatics = Object.assign(
	LinkButton,
	PureLinkButton,
) as typeof PureLinkButton;

export { LinkButtonWithStatics as LinkButton, linkButtonClassNames };
export type { LinkButtonProps, LinkButtonProps as PureLinkButtonProps };

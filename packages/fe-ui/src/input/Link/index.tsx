"use client";

import { observer } from "mobx-react-lite";
import { type LinkProps, Link as PureLink } from "./Link";

const Link = observer((props: LinkProps) => {
	return <PureLink {...props} />;
});

export { Link };
export type { LinkProps, LinkProps as PureLinkProps };

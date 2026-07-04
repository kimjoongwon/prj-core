"use client";

import { observer } from "mobx-react-lite";
import {
	type CustomHeaderProps,
	CustomHeader as PureCustomHeader,
} from "./CustomHeader";

const CustomHeader = observer((props: CustomHeaderProps) => {
	return <PureCustomHeader {...props} />;
});

export { CustomHeader };
export type { CustomHeaderProps, CustomHeaderProps as PureCustomHeaderProps };

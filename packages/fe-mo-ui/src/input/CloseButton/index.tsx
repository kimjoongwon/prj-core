"use client";

import { observer } from "mobx-react-lite";
import {
	type CloseButtonProps,
	closeButtonClassNames,
	CloseButton as PureCloseButton,
} from "./CloseButton";

const CloseButton = observer((props: CloseButtonProps) => {
	return <PureCloseButton {...props} />;
});

const CloseButtonWithStatics = Object.assign(
	CloseButton,
	PureCloseButton,
) as typeof PureCloseButton;

export { CloseButtonWithStatics as CloseButton, closeButtonClassNames };
export type { CloseButtonProps, CloseButtonProps as PureCloseButtonProps };

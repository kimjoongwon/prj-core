"use client";

import { observer } from "mobx-react-lite";
import { type ButtonProps, Button as PureButton } from "./Button";

const Button = observer((props: ButtonProps) => {
	return <PureButton {...props} />;
});

export { Button };
export type { ButtonProps, ButtonProps as PureButtonProps };

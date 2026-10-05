"use client";

import { observer } from "mobx-react-lite";
import {
	type ButtonProps,
	buttonClassNames,
	Button as PureButton,
	useButton,
} from "./Button";

const Button = observer((props: ButtonProps) => {
	return <PureButton {...props} />;
});

const ButtonWithStatics = Object.assign(
	Button,
	PureButton,
) as typeof PureButton;

export { ButtonWithStatics as Button, buttonClassNames, useButton };
export type { ButtonProps, ButtonProps as PureButtonProps };

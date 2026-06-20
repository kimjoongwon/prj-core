"use client";

import {
	BUTTON_GROUP_CHILD,
	ButtonGroup as HeroButtonGroup,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";
import type { ButtonGroupProps } from "./ButtonGroup.props";

type ButtonGroupSeparatorProps = ComponentProps<
	typeof HeroButtonGroup.Separator
> & {
	[BUTTON_GROUP_CHILD]?: boolean;
};

const ButtonGroupBase = (props: ButtonGroupProps) => {
	return <HeroButtonGroup {...props} />;
};

const ButtonGroupSeparatorBase = (props: ButtonGroupSeparatorProps) => {
	const { [BUTTON_GROUP_CHILD]: _isButtonGroupChild, ...separatorProps } =
		props;

	return <HeroButtonGroup.Separator {...separatorProps} />;
};

export const ButtonGroup = Object.assign(
	observer(ButtonGroupBase),
	HeroButtonGroup,
	{
		Separator: observer(ButtonGroupSeparatorBase),
	},
) as unknown as typeof HeroButtonGroup;

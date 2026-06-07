"use client";

import { CloseButton as HeroCloseButton } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type CloseButtonProps = ComponentProps<typeof HeroCloseButton>;

const CloseButtonBase = (props: CloseButtonProps) => {
	return <HeroCloseButton {...props} />;
};

export const CloseButton = Object.assign(
	observer(CloseButtonBase),
	HeroCloseButton,
) as unknown as typeof HeroCloseButton;

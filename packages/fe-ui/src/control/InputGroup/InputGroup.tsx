"use client";

import { InputGroup as HeroInputGroup } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type InputGroupProps = ComponentProps<typeof HeroInputGroup>;

const InputGroupBase = (props: InputGroupProps) => {
	return <HeroInputGroup {...props} />;
};

export const InputGroup = Object.assign(
	observer(InputGroupBase),
	HeroInputGroup,
) as unknown as typeof HeroInputGroup;

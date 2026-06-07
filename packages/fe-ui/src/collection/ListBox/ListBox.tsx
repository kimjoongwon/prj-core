"use client";

import { ListBox as HeroListBox } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type ListBoxProps = ComponentProps<typeof HeroListBox>;

const ListBoxBase = (props: ListBoxProps) => {
	return <HeroListBox {...props} />;
};

export const ListBox = Object.assign(
	observer(ListBoxBase),
	HeroListBox,
) as unknown as typeof HeroListBox;

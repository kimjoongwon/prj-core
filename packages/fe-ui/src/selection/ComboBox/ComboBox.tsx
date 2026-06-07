"use client";

import { ComboBox as HeroComboBox } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type ComboBoxProps = ComponentProps<typeof HeroComboBox>;

const ComboBoxBase = (props: ComboBoxProps) => {
	return <HeroComboBox {...props} />;
};

export const ComboBox = Object.assign(
	observer(ComboBoxBase),
	HeroComboBox,
) as unknown as typeof HeroComboBox;

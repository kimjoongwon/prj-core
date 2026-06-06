import { ButtonGroup as HeroButtonGroup } from "@heroui/react";
import type { ComponentProps } from "react";
import type { ButtonGroupItem } from "./ButtonGroupItem.props";

export interface ButtonGroupProps
	extends Omit<ComponentProps<typeof HeroButtonGroup.Root>, "children"> {
	leftButtons?: ButtonGroupItem[];
	rightButtons?: ButtonGroupItem[];
}

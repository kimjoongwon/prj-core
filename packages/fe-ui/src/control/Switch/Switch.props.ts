import { Switch as HeroSwitch } from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";

type SwitchClassNames = Partial<
	Record<"base" | "control" | "thumb" | "icon" | "content", string>
>;

export interface SwitchProps
	extends Omit<ComponentProps<typeof HeroSwitch.Root>, "children" | "onChange" | "value"> {
	children?: ReactNode;
	value?: boolean;
	onValueChange?: (isSelected: boolean) => void;
	onChange?: (isSelected: boolean) => void;
	classNames?: SwitchClassNames;
}

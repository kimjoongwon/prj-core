import { Checkbox as HeroCheckbox } from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";

type CheckboxClassNames = Partial<
	Record<"base" | "control" | "indicator" | "content", string>
>;

export interface CheckboxProps
	extends Omit<
		ComponentProps<typeof HeroCheckbox.Root>,
		"children" | "onChange"
	> {
	children?: ReactNode;
	onChange?: (checked: boolean) => void;
	onValueChange?: (checked: boolean) => void;
	classNames?: CheckboxClassNames;
}

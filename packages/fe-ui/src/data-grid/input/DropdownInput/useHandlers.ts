import type { Key } from "react";
import type { ButtonProps } from "../../../input/Button/Button";
import type { DropdownInputProps } from "./DropdownInput";

function resolveButtonVariant(
	variant: string | undefined,
): ButtonProps["variant"] {
	return variant === "solid"
		? "primary"
		: variant === "bordered"
			? "outline"
			: "ghost";
}

export function useHandlers(state: DropdownInputProps) {
	return {
		buttonVariant: resolveButtonVariant(state.config.props?.variant),
		activateMenuItem(menuItemKey: Key) {
			const menuItem = state.config.props?.items?.find(
				(menuItem) => menuItem.key === menuItemKey,
			);
			menuItem?.onClick?.();
		},
	};
}

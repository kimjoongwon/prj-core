import type { ButtonProps } from "../../../input/Button/Button";
import type { ButtonInputProps } from "./ButtonInput";

function resolveButtonVariant(
	variant: string | undefined,
	color: string | undefined,
): ButtonProps["variant"] {
	if (color === "danger") {
		return variant === "solid" ? "danger" : "danger-soft";
	}
	if (variant === "solid") {
		return "primary";
	}
	return variant === "bordered" ? "outline" : "ghost";
}

export function useHandlers(state: ButtonInputProps) {
	return {
		buttonVariant: resolveButtonVariant(
			state.config.props?.variant,
			state.config.props?.color,
		),
		clickButton() {
			state.config.handlers?.onClick?.();
		},
	};
}

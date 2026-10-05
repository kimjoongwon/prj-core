"use client";

import type { InputConfig } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";
import { Button, type ButtonProps } from "../../input/Button/Button";

interface ButtonInputProps {
	config: InputConfig;
}

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

export const ButtonInput = observer(({ config }: ButtonInputProps) => {
	const t = useT();
	const handleClick = () => {
		config.handlers?.onClick?.();
	};

	return (
		<Button
			variant={resolveButtonVariant(config.props?.variant, config.props?.color)}
			size={config.props?.size ?? "md"}
			onPress={handleClick}
		>
			{config.props?.startContent}
			{config.label ? t(config.label) : null}
		</Button>
	);
});

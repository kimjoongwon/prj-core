"use client";

import type { InputConfig } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";
import { Button } from "../../input/Button/Button";

interface ButtonInputProps {
	config: InputConfig;
}

function resolveButtonVariant(
	variant: InputConfig["props"] extends { variant?: infer Value } ? Value : never,
	color: InputConfig["props"] extends { color?: infer Value } ? Value : never,
) {
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
			startContent={config.props?.startContent}
			onPress={handleClick}
		>
			{config.label ? t(config.label) : null}
		</Button>
	);
});

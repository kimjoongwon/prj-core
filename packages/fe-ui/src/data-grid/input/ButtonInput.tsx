"use client";

import type { InputConfig } from "@cocrepo/type";
import { Button } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";

interface ButtonInputProps {
	config: InputConfig;
}

export const ButtonInput = observer(({ config }: ButtonInputProps) => {
	const t = useT();
	const handleClick = () => {
		config.handlers?.onClick?.();
	};

	return (
		<Button
			variant={config.props?.variant ?? "solid"}
			color={config.props?.color ?? "default"}
			size={config.props?.size ?? "md"}
			startContent={config.props?.startContent}
			onPress={handleClick}
		>
			{config.label ? t(config.label) : null}
		</Button>
	);
});

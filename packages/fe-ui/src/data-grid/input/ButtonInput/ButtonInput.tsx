"use client";

import type { InputConfig } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { useT } from "../../../i18n";
import { Button } from "../../../input/Button/Button";
import { useHandlers } from "./useHandlers";

export interface ButtonInputProps {
	config: InputConfig;
}

export const ButtonInput = observer((state: ButtonInputProps) => {
	const { config } = state;
	const t = useT();
	const handlers = useHandlers(state);

	return (
		<Button
			variant={handlers.buttonVariant}
			size={config.props?.size ?? "md"}
			onPress={handlers.clickButton}
		>
			{config.props?.startContent}
			{config.label ? t(config.label) : null}
		</Button>
	);
});

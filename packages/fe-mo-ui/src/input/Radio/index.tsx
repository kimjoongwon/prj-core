"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	PureRadio,
	type PureRadioProps,
	radioClassNames,
	useRadio,
} from "./Radio";

export interface RadioProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<PureRadioProps, "isSelected" | "onSelectedChange"> {}

const Radio = observer(<TState extends object>(props: RadioProps<TState>) => {
	const { path, state, ...rest } = props;
	const field = useFormField<TState, boolean>({
		path,
		state,
		value: (tools.get(state, path) ?? false) as boolean,
	});

	return (
		<PureRadio
			{...rest}
			isSelected={Boolean(field.state.value)}
			onSelectedChange={field.setValue}
		/>
	);
});
Radio.displayName = "Radio";

const RadioWithStatics = Object.assign(Radio, PureRadio) as typeof Radio &
	typeof PureRadio;
export { RadioWithStatics as Radio };
export { PureRadio, radioClassNames, useRadio };
export type { PureRadioProps };

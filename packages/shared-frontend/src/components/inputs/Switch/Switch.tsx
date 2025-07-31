import {
	Switch as NextUISwitch,
	SwitchProps as NextUISwitchProps,
} from "@heroui/react";
import { get } from "lodash-es";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useMobxHookForm } from "../../../hooks";
import type { MobxProps } from "../../../types";

export interface SwitchProps<T> extends NextUISwitchProps, MobxProps<T> {}

export const Switch = observer(<T extends object>(props: SwitchProps<T>) => {
	const { path = "", state = {}, ...rest } = props;

	const initialValue = get(state, path);

	const { localState } = useMobxHookForm(initialValue, state, path);

	const onChange = action((isSelected: boolean) => {
		localState.value = isSelected;
	});

	return (
		<NextUISwitch {...rest} onValueChange={onChange} value={localState.value} />
	);
});

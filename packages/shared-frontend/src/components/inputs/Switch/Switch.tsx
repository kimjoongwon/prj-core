import { Switch as NextUISwitch } from "@heroui/react";
import type { SwitchProps } from "../../../types";
import { get } from "lodash-es";
import { action } from "mobx";
import { useMobxHookForm } from "../../../hooks";
import { observer } from "mobx-react-lite";

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

import {
	Checkbox as NextUICheckbox,
	CheckboxProps as NextUICheckboxProps,
} from "@heroui/react";
import { get } from "lodash-es";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useMobxHookForm } from "../../../hooks/useMobxHookForm";
import type { MobxProps } from "../../../types";
import { Text } from "../../ui/Text/Text";

export interface CheckboxProps<T> extends MobxProps<T>, NextUICheckboxProps {}

function BaseCheckbox<T extends object>(props: CheckboxProps<T>) {
	const { path = "", state = {}, ...rest } = props;

	const { localState } = useMobxHookForm(get(state, path), state, path);

	const onChange = action((e: React.ChangeEvent<HTMLInputElement>) => {
		localState.value = e.target.checked;
	});

	return (
		<NextUICheckbox
			{...rest}
			onChange={onChange}
			size="lg"
			isSelected={localState.value}
		>
			<Text className="font-bold">{props.children}</Text>
		</NextUICheckbox>
	);
}

export const Checkbox = observer(BaseCheckbox);

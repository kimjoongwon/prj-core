import type { TextAreaProps } from "@heroui/react";
import { Textarea as BaseTextarea } from "@heroui/react";
import type { MobxProps } from "../../../types";

export interface BaseTextareaProps<T> extends TextAreaProps, MobxProps<T> {}

import { get } from "lodash-es";
import { observer } from "mobx-react-lite";
import { useMobxHookForm } from "../../../hooks";

export const Textarea = observer(
	<T extends object>(props: BaseTextareaProps<T>) => {
		const { value, state = {}, path = "", ...rest } = props;
		const initialValue = get(state, path, value);
		const { localState } = useMobxHookForm(initialValue, state, path);

		const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			localState.value = e.target.value;
		};

		return (
			<BaseTextarea
				{...rest}
				value={localState.value}
				onChange={handleOnChange}
			/>
		);
	},
);

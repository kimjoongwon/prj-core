import { useFormField } from "@shared/hooks";
import { get } from "lodash-es";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React, { forwardRef, useImperativeHandle, useCallback } from "react";
import { Checkbox as BaseCheckbox } from "./Checkbox";
import type { CheckboxProps, CheckboxRef } from "./types";

export const Checkbox = observer(
	forwardRef<CheckboxRef, CheckboxProps>(
		(
			{
				state,
				path,
				isSelected: controlledSelected,
				defaultSelected = false,
				onValueChange,
				...props
			},
			ref,
		) => {
			// 무조건 MobX 사용 - controlledSelected는 무시됨
			const initialValue = get(state, path, defaultSelected);

			const { localState } = useFormField({
				initialValue,
				state,
				path,
			});

			// 항상 localState.value 사용
			const isSelected = localState.value;

			const handleValueChange = useCallback(
				action((newValue: boolean) => {
					localState.value = newValue;
					onValueChange?.(newValue);
				}),
				[localState, onValueChange],
			);

			const toggle = useCallback(() => {
				const newValue = !localState.value;
				handleValueChange(newValue);
			}, [localState, handleValueChange]);

			useImperativeHandle(
				ref,
				() => ({
					toggle,
					focus: () => {},
					blur: () => {},
				}),
				[toggle],
			);

			return (
				<BaseCheckbox
					{...props}
					ref={ref}
					isSelected={isSelected}
					defaultSelected={undefined}
					onValueChange={handleValueChange}
				/>
			);
		},
	),
);

Checkbox.displayName = "MobxCheckbox";

export { default } from "./Checkbox";
export type {
	CheckboxProps,
	CheckboxRef,
	CheckboxSize,
	CheckboxColor,
	CheckboxRadius,
	MobxProps,
} from "./types";

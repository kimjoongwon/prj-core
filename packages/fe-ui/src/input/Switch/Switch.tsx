import { useInputStateInspection } from "@cocrepo/hook";
import { Switch as HeroSwitch } from "@heroui/react";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useCallback, useEffect, useId } from "react";
import type { SwitchProps } from "./Switch.props";

/**
 * Switch 컴포넌트
 * 토글 스위치 컴포넌트입니다.
 */
export function createSwitchState(initialValue = false) {
	return makeAutoObservable(
		{
			value: initialValue,
			setValue(nextValue: boolean) {
				this.value = nextValue;
			},
		},
		{},
		{ autoBind: true, name: "SwitchState" },
	);
}
export type SwitchState = ReturnType<typeof createSwitchState>;

export const Switch = observer((props: SwitchProps) => {
	const {
		children,
		classNames,
		onChange,
		onValueChange,
		size,
		value,
		...rest
	} = props;
	const internalState = useLocalObservable(() =>
		createSwitchState(rest.defaultSelected ?? false),
	);
	const inputStateId = useId();
	const inspection = useInputStateInspection();
	const isControlled = value !== undefined || rest.isSelected !== undefined;
	const selectedValue =
		rest.isSelected ?? (isControlled ? value : internalState.value);
	const reader = useCallback(
		() => (isControlled ? (rest.isSelected ?? value) : internalState.value),
		[internalState, isControlled, rest.isSelected, value],
	);
	useEffect(
		() => inspection?.registerInputState(inputStateId, reader),
		[inspection, inputStateId, reader, selectedValue],
	);

	const handleChange = (isSelected: boolean) => {
		if (!isControlled) internalState.setValue(isSelected);
		onChange?.(isSelected);
		onValueChange?.(isSelected);
	};

	return (
		<HeroSwitch
			{...rest}
			className={classNames?.base ?? rest.className}
			isSelected={selectedValue}
			onChange={handleChange}
			size={size}
		>
			<HeroSwitch.Control className={classNames?.control}>
				<HeroSwitch.Thumb className={classNames?.thumb} />
			</HeroSwitch.Control>
			{children ? (
				<HeroSwitch.Content className={classNames?.content}>
					{children}
				</HeroSwitch.Content>
			) : null}
		</HeroSwitch>
	);
});

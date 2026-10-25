import { useInputStateInspection } from "@cocrepo/hook";
import { Checkbox as HeroCheckbox } from "@heroui/react";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useCallback, useEffect, useId } from "react";
import { translateNode, useT } from "../../i18n";
import type { CheckboxProps } from "./Checkbox.props";

/**
 * Checkbox 컴포넌트
 * HeroUI Checkbox의 래퍼로, boolean 값 핸들링을 제공합니다.
 *
 * @example
 * ```tsx
 * <Checkbox
 *   isSelected={agreed}
 *   onChange={setAgreed}
 * >
 *   이용약관에 동의합니다
 * </Checkbox>
 *
 * // 비활성화
 * <Checkbox isDisabled>비활성화됨</Checkbox>
 * ```
 */
export function createCheckboxState(initialValue = false) {
	return makeAutoObservable(
		{
			value: initialValue,
			setValue(nextValue: boolean) {
				this.value = nextValue;
			},
		},
		{},
		{ autoBind: true, name: "CheckboxState" },
	);
}
export type CheckboxState = ReturnType<typeof createCheckboxState>;

export const Checkbox = observer((props: CheckboxProps) => {
	const t = useT();
	const { children, classNames, onChange, onValueChange, ...rest } = props;
	const internalState = useLocalObservable(() =>
		createCheckboxState(rest.defaultSelected ?? false),
	);
	const inputStateId = useId();
	const inspection = useInputStateInspection();
	const isControlled = rest.isSelected !== undefined;
	const selectedValue = isControlled ? rest.isSelected : internalState.value;
	const reader = useCallback(
		() => (isControlled ? rest.isSelected : internalState.value),
		[internalState, isControlled, rest.isSelected],
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
		<HeroCheckbox
			{...rest}
			isSelected={selectedValue}
			className={classNames?.base ?? rest.className}
			onChange={handleChange}
		>
			<HeroCheckbox.Control className={classNames?.control}>
				<HeroCheckbox.Indicator className={classNames?.indicator} />
			</HeroCheckbox.Control>
			{children ? (
				<HeroCheckbox.Content className={classNames?.content ?? "font-bold"}>
					{translateNode(children, t)}
				</HeroCheckbox.Content>
			) : null}
		</HeroCheckbox>
	);
});

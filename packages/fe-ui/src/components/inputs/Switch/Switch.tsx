import {
	Switch as NextUISwitch,
	type SwitchProps as NextUISwitchProps,
} from "@heroui/react";

export interface SwitchProps
	extends Omit<NextUISwitchProps, "onValueChange" | "value"> {
	/** 스위치 상태 */
	value?: boolean;
	/** 상태 변경 핸들러 */
	onValueChange?: (isSelected: boolean) => void;
}

/**
 * Switch 컴포넌트
 * 토글 스위치 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <Switch
 *   value={isEnabled}
 *   onValueChange={setIsEnabled}
 * >
 *   알림 받기
 * </Switch>
 * ```
 */
export const Switch = (props: SwitchProps) => {
	const { onValueChange, value, ...rest } = props;

	return (
		<NextUISwitch {...rest} onValueChange={onValueChange} isSelected={value} />
	);
};

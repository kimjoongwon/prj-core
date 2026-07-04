import { Checkbox as HeroCheckbox } from "@heroui/react";
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
export const Checkbox = (props: CheckboxProps) => {
	const t = useT();
	const { children, classNames, onChange, onValueChange, ...rest } = props;

	const handleChange = (isSelected: boolean) => {
		onChange?.(isSelected);
		onValueChange?.(isSelected);
	};

	return (
		<HeroCheckbox
			{...rest}
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
};

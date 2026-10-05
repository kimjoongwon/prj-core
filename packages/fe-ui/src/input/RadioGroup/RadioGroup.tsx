import {
	FieldError,
	RadioGroup as HeroRadioGroup,
	Label,
	Radio,
} from "@heroui/react";
import { translateNode, useT } from "../../i18n";
import type { RadioGroupProps } from "./RadioGroup.props";

/**
 * RadioGroup 컴포넌트
 * 라디오 버튼 그룹 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * const options = [
 *   { value: "email", text: "이메일" },
 *   { value: "sms", text: "문자" },
 *   { value: "push", text: "푸시 알림" },
 * ];
 *
 * <RadioGroup
 *   label="알림 방법"
 *   options={options}
 *   value={notificationMethod}
 *   onValueChange={setNotificationMethod}
 * />
 * ```
 */
export function RadioGroup(props: RadioGroupProps) {
	const t = useT();
	const {
		options = [
			{
				text: "test",
				value: "test",
			},
			{
				text: "test2",
				value: "test2",
			},
		],
		label,
		children,
		value,
		onValueChange,
		onChange,
		errorMessage,
		...rest
	} = props;

	const handleChange = (value: string) => {
		onChange?.(value);
		onValueChange?.(value);
	};

	return (
		<HeroRadioGroup {...rest} value={value} onChange={handleChange}>
			{label ? <Label>{translateNode(label, t)}</Label> : null}
			{children ??
				options.map((option) => (
					<Radio key={option.value} value={String(option.value)}>
						<Radio.Control>
							<Radio.Indicator />
						</Radio.Control>
						<Radio.Content>{t(option.text)}</Radio.Content>
					</Radio>
				))}
			{errorMessage ? (
				<FieldError>{translateNode(errorMessage, t)}</FieldError>
			) : null}
		</HeroRadioGroup>
	);
}

export type { RadioGroupProps, RadioOption } from "./RadioGroup.props";

"use client";

import {
	FieldError,
	RadioGroup as HeroRadioGroup,
	Label,
	Radio,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { translateNode, useT } from "../../i18n";
import type { RadioGroupProps } from "./RadioGroup.props";

/**
 * RadioGroup 컴포넌트
 * 라디오 버튼 그룹 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * const options = [
 *   { value: "card", text: "신용카드" },
 *   { value: "bank", text: "계좌이체" },
 *   { value: "phone", text: "휴대폰결제" },
 * ];
 *
 * <RadioGroup
 *   label="결제 방법"
 *   options={options}
 *   value={paymentMethod}
 *   onValueChange={setPaymentMethod}
 * />
 * ```
 */
export const RadioGroup = observer(function RadioGroup(props: RadioGroupProps) {
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
});

export type { RadioGroupProps, RadioOption } from "./RadioGroup.props";

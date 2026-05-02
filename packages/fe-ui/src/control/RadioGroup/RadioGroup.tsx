"use client";

import {
	RadioGroup as NextUIRadioGroup,
	type RadioGroupProps as NextUIRadioGroupProps,
	Radio,
} from "@cocrepo/ui/heroui";
import { observer } from "mobx-react-lite";
import { translateNode, useT } from "../../i18n";

export interface RadioOption {
	/** 표시 텍스트 */
	text: string;
	/** 옵션 값 */
	value: any;
}

export interface RadioGroupProps
	extends Omit<NextUIRadioGroupProps, "onValueChange" | "value"> {
	/** 라디오 옵션 목록 */
	options?: RadioOption[];
	/** 선택된 값 */
	value?: string;
	/** 값 변경 핸들러 */
	onValueChange?: (value: string) => void;
}

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
		value,
		onValueChange,
		...rest
	} = props;

	return (
		<NextUIRadioGroup
			{...rest}
			label={translateNode(rest.label, t)}
			value={value}
			onValueChange={onValueChange}
		>
			{options.map((option) => (
				<Radio key={option.value} value={option.value}>
					{t(option.text)}
				</Radio>
			))}
		</NextUIRadioGroup>
	);
});

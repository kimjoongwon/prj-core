import { Label, ListBox, Select } from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";

type SelectKey = string | number;

type MultiSelectOption = {
	label?: ReactNode;
	name?: ReactNode;
	text?: ReactNode;
	value: SelectKey;
};

export interface MultiSelectProps<_T>
	extends Omit<
		ComponentProps<typeof Select<object, "multiple">>,
		"children" | "onChange" | "selectionMode" | "value"
	> {
	/** 선택 옵션 목록 ({ value, name } 형식) */
	options?: MultiSelectOption[];
	/** 선택된 값 목록 */
	value?: readonly SelectKey[];
	/** 선택 변경 핸들러 */
	onChange?: (value: SelectKey[]) => void;
	/** 라벨 */
	label?: ReactNode;
}

/**
 * MultiSelect 컴포넌트
 * 여러 항목을 동시에 선택할 수 있는 Select 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * const options = [
 *   { value: "react", name: "React" },
 *   { value: "vue", name: "Vue" },
 *   { value: "angular", name: "Angular" },
 * ];
 *
 * <MultiSelect
 *   label="기술 스택"
 *   options={options}
 *   value={selectedTechs}
 *   onChange={setSelectedTechs}
 * />
 * ```
 */
export const MultiSelect = <T extends object>(props: MultiSelectProps<T>) => {
	const { label, options = [], value, onChange, placeholder, ...rest } = props;
	const ariaLabel =
		rest["aria-label"] ??
		(typeof label === "string"
			? label
			: typeof placeholder === "string"
				? placeholder
				: "Select options");

	const handleChange = (nextValue: SelectKey | SelectKey[] | null) => {
		const nextValues: SelectKey[] = Array.isArray(nextValue)
			? nextValue
			: nextValue === null
				? []
				: [nextValue];
		onChange?.(nextValues);
	};

	return (
		<Select
			{...rest}
			aria-label={ariaLabel}
			placeholder={placeholder}
			selectionMode="multiple"
			value={value}
			onChange={handleChange}
		>
			{label ? <Label>{label}</Label> : null}
			<Select.Trigger>
				<Select.Value />
				<Select.Indicator />
			</Select.Trigger>
			<Select.Popover>
				<ListBox>
					{options.map((option) => {
						const optionLabel =
							option.name ??
							option.label ??
							option.text ??
							String(option.value);

						return (
							<ListBox.Item
								id={option.value}
								key={String(option.value)}
								textValue={String(optionLabel)}
							>
								{optionLabel}
								<ListBox.ItemIndicator />
							</ListBox.Item>
						);
					})}
				</ListBox>
			</Select.Popover>
		</Select>
	);
};

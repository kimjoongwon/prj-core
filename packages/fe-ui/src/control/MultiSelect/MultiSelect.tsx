import {
	Select as NextSelect,
	type SelectProps as NextUISelectProps,
	SelectItem,
	type Selection,
} from "../../design-system/primitives";

export interface MultiSelectProps<_T>
	extends Omit<
		NextUISelectProps,
		"children" | "selectionMode" | "onChange" | "selectedKeys"
	> {
	/** 선택 옵션 목록 ({ value, name } 형식) */
	options?: any[];
	/** 선택된 키들 */
	selectedKeys?: Selection;
	/** 선택 변경 핸들러 */
	onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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
 *   selectedKeys={selectedTechs}
 *   onChange={(e) => setSelectedTechs(new Set(e.target.value.split(",")))}
 * />
 * ```
 */
export const MultiSelect = <T extends object>(props: MultiSelectProps<T>) => {
	const { options = [], selectedKeys, onChange, ...rest } = props;

	return (
		<NextSelect
			{...rest}
			variant="bordered"
			selectionMode="multiple"
			selectedKeys={selectedKeys}
			onChange={onChange}
		>
			{options.map((option) => {
				return <SelectItem key={option.value}>{option.name}</SelectItem>;
			})}
		</NextSelect>
	);
};

import type { AutocompleteProps } from "../../design-system/primitives";
import { Autocomplete, AutocompleteItem } from "../../design-system/primitives";

type AutoCompleteItem = {
	/** 표시 텍스트 */
	label: string;
	/** 설명 텍스트 */
	description?: string;
	/** 아이템 고유 키 */
	key?: string;
};

export interface AutoCompleteProps
	extends Omit<
		AutocompleteProps<AutoCompleteItem>,
		"children" | "onSelectionChange"
	> {
	/** 선택 변경 핸들러 */
	onSelectionChange?: (key: string | number | null) => void;
}

/**
 * AutoComplete 컴포넌트
 * 검색과 자동완성 기능이 있는 입력 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * const items = [
 *   { key: "1", label: "서울" },
 *   { key: "2", label: "부산" },
 *   { key: "3", label: "대구" },
 * ];
 *
 * <AutoComplete
 *   label="도시 선택"
 *   defaultItems={items}
 *   onSelectionChange={(key) => setSelectedCity(key)}
 * />
 * ```
 */
export const AutoComplete = (props: AutoCompleteProps) => {
	const {
		defaultItems = [],
		label = "label",
		onSelectionChange,
		...rest
	} = props;

	return (
		<Autocomplete
			{...rest}
			label={label}
			defaultItems={defaultItems}
			onSelectionChange={onSelectionChange}
		>
			{(item) => (
				<AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
			)}
		</Autocomplete>
	);
};

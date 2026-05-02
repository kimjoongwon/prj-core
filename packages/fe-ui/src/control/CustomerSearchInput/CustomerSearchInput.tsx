"use client";

import type { AutocompleteProps } from "@cocrepo/ui/heroui";
import { Autocomplete, AutocompleteItem } from "@cocrepo/ui/heroui";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";

export interface CustomerSearchResult {
	/** 고객 ID */
	id: string;
	/** 고객명 */
	name: string;
	/** 이메일 */
	email?: string;
	/** 연락처 */
	phone?: string;
	/** 표시용 라벨 */
	label: string;
	/** 설명 (부가 정보) */
	description?: string;
}

export interface CustomerSearchInputProps
	extends Omit<
		AutocompleteProps<CustomerSearchResult>,
		"children" | "onSelectionChange" | "defaultItems"
	> {
	/** 검색 결과 목록 */
	items?: CustomerSearchResult[];
	/** 선택 변경 핸들러 */
	onSelectionChange?: (customer: CustomerSearchResult | null) => void;
	/** 입력값 변경 핸들러 (검색용) */
	onInputChange?: (value: string) => void;
}

/**
 * 고객 검색 입력 컴포넌트
 * 기존 고객을 검색하고 선택하는 자동완성 입력입니다.
 *
 * @example
 * ```tsx
 * const [searchResults, setSearchResults] = useState([]);
 *
 * <CustomerSearchInput
 *   label="고객 검색"
 *   items={searchResults}
 *   onInputChange={(value) => searchCustomers(value)}
 *   onSelectionChange={(customer) => selectCustomer(customer)}
 * />
 * ```
 */
export const CustomerSearchInput = observer(function CustomerSearchInput(
	props: CustomerSearchInputProps,
) {
	const t = useT();
	const {
		items = [],
		label = "고객 검색",
		placeholder = "고객명, 이메일, 연락처로 검색",
		onSelectionChange,
		onInputChange,
		...rest
	} = props;

	const handleSelectionChange = (key: string | number | null) => {
		if (!key) {
			onSelectionChange?.(null);
			return;
		}

		const selectedCustomer = items.find((item) => item.id === key);
		onSelectionChange?.(selectedCustomer || null);
	};

	const handleInputChange = (value: string) => {
		onInputChange?.(value);
	};

	return (
		<Autocomplete
			{...rest}
			label={typeof label === "string" ? t(label) : label}
			placeholder={
				typeof placeholder === "string" ? t(placeholder) : placeholder
			}
			defaultItems={items}
			onSelectionChange={handleSelectionChange}
			onInputChange={handleInputChange}
			variant="bordered"
			clearButtonProps={{
				"aria-label": t("검색어 지우기"),
			}}
		>
			{(item) => (
				<AutocompleteItem
					key={item.id}
					textValue={item.label}
					description={item.description}
				>
					<div className="flex flex-col">
						<span className="font-medium">{item.name}</span>
						{(item.email || item.phone) && (
							<span className="text-small text-default-500">
								{[item.email, item.phone].filter(Boolean).join(" | ")}
							</span>
						)}
					</div>
				</AutocompleteItem>
			)}
		</Autocomplete>
	);
});

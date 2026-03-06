import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	CustomerSearchInput as BaseCustomerSearchInput,
	type CustomerSearchInputProps as BaseCustomerSearchInputProps,
	type CustomerSearchResult,
} from "./CustomerSearchInput";

export interface CustomerSearchInputProps<T>
	extends MobxProps<T>,
		Omit<
			BaseCustomerSearchInputProps,
			"value" | "onSelectionChange" | "items"
		> {
	/** 검색 결과 목록 */
	items?: CustomerSearchResult[];
	/** 선택 변경 핸들러 */
	onSelectionChange?: (customer: CustomerSearchResult | null) => void;
}

export const CustomerSearchInput = observer(
	<T extends object>(props: CustomerSearchInputProps<T>) => {
		const { path, state, onSelectionChange, items, ...rest } = props;

		const initialValue = tools.get(state, path) || "";

		const formField = useFormField({
			value: initialValue,
			state,
			path,
		});

		const handleSelectionChange = (customer: CustomerSearchResult | null) => {
			formField.setValue(customer?.id || "");
			onSelectionChange?.(customer);
		};

		return (
			<BaseCustomerSearchInput
				{...rest}
				items={items}
				onSelectionChange={handleSelectionChange}
			/>
		);
	},
);

export type { BaseCustomerSearchInputProps as PureCustomerSearchInputProps };
export type { CustomerSearchResult };
export { CustomerSearchInput as PureCustomerSearchInput } from "./CustomerSearchInput";

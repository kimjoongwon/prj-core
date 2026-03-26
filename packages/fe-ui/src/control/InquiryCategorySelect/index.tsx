import { useFormField } from "@cocrepo/hook";
import {
	type InquiryCategory as InquiryCategoryType,
} from "@cocrepo/enum";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	InquiryCategorySelect as BaseInquiryCategorySelect,
	type InquiryCategorySelectProps as BaseInquiryCategorySelectProps,
} from "./InquiryCategorySelect";

export interface InquiryCategorySelectProps<T>
	extends MobxProps<T>,
		Omit<BaseInquiryCategorySelectProps, "value" | "onChange"> {}

export const InquiryCategorySelect = observer(
	<T extends object>(props: InquiryCategorySelectProps<T>) => {
		const { path, state, ...rest } = props;

		const initialValue = tools.get(state, path) || "";

		const formField = useFormField({
			value: initialValue,
			state,
			path,
		});

		const handleChange = (value: InquiryCategoryType) => {
			formField.setValue(value);
		};

		return (
			<BaseInquiryCategorySelect
				{...rest}
				value={formField.state.value as InquiryCategoryType}
				onChange={handleChange}
			/>
		);
	},
);

export type {
	BaseInquiryCategorySelectProps as PureInquiryCategorySelectProps,
};
export {
	InquiryCategorySelect as PureInquiryCategorySelect,
} from "./InquiryCategorySelect";

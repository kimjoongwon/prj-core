import { useFormField } from "@cocrepo/hook";
import { type InquiryStatus as InquiryStatusType } from "@cocrepo/enum";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	InquiryStatusSelect as BaseInquiryStatusSelect,
	type InquiryStatusSelectProps as BaseInquiryStatusSelectProps,
} from "./InquiryStatusSelect";

export interface InquiryStatusSelectProps<T>
	extends MobxProps<T>,
		Omit<BaseInquiryStatusSelectProps, "value" | "onChange"> {}

export const InquiryStatusSelect = observer(
	<T extends object>(props: InquiryStatusSelectProps<T>) => {
		const { path, state, ...rest } = props;

		const initialValue = tools.get(state, path) || "NEW";

		const formField = useFormField({
			value: initialValue,
			state,
			path,
		});

		const handleChange = (value: InquiryStatusType) => {
			formField.setValue(value);
		};

		return (
			<BaseInquiryStatusSelect
				{...rest}
				value={formField.state.value as InquiryStatusType}
				onChange={handleChange}
			/>
		);
	},
);

export type { BaseInquiryStatusSelectProps as PureInquiryStatusSelectProps };
export { InquiryStatusSelect as PureInquiryStatusSelect } from "./InquiryStatusSelect";

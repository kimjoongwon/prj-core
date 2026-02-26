import { useFormField } from "@cocrepo/hook";
import { type InquiryPriority as InquiryPriorityType } from "@cocrepo/enum";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	InquiryPrioritySelect as BaseInquiryPrioritySelect,
	type InquiryPrioritySelectProps as BaseInquiryPrioritySelectProps,
} from "./InquiryPrioritySelect";

export interface InquiryPrioritySelectProps<T>
	extends MobxProps<T>,
		Omit<BaseInquiryPrioritySelectProps, "value" | "onChange"> {}

export const InquiryPrioritySelect = observer(
	<T extends object>(props: InquiryPrioritySelectProps<T>) => {
		const { path, state, ...rest } = props;

		const initialValue = tools.get(state, path) || "NORMAL";

		const formField = useFormField({
			value: initialValue,
			state,
			path,
		});

		const handleChange = (value: InquiryPriorityType) => {
			formField.setValue(value);
		};

		return (
			<BaseInquiryPrioritySelect
				{...rest}
				value={formField.state.value as InquiryPriorityType}
				onChange={handleChange}
			/>
		);
	},
);

export type { BaseInquiryPrioritySelectProps as PureInquiryPrioritySelectProps };
export { InquiryPrioritySelect as PureInquiryPrioritySelect } from "./InquiryPrioritySelect";

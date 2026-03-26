import { useFormField } from "@cocrepo/hook";
import { type InquiryChannel as InquiryChannelType } from "@cocrepo/enum";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	InquiryChannelSelect as BaseInquiryChannelSelect,
	type InquiryChannelSelectProps as BaseInquiryChannelSelectProps,
} from "./InquiryChannelSelect";

export interface InquiryChannelSelectProps<T>
	extends MobxProps<T>,
		Omit<BaseInquiryChannelSelectProps, "value" | "onChange"> {}

export const InquiryChannelSelect = observer(
	<T extends object>(props: InquiryChannelSelectProps<T>) => {
		const { path, state, ...rest } = props;

		const initialValue = tools.get(state, path) || "";

		const formField = useFormField({
			value: initialValue,
			state,
			path,
		});

		const handleChange = (value: InquiryChannelType) => {
			formField.setValue(value);
		};

		return (
			<BaseInquiryChannelSelect
				{...rest}
				value={formField.state.value as InquiryChannelType}
				onChange={handleChange}
			/>
		);
	},
);

export type { BaseInquiryChannelSelectProps as PureInquiryChannelSelectProps };
export { InquiryChannelSelect as PureInquiryChannelSelect } from "./InquiryChannelSelect";

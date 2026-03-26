import { useFormField } from "@cocrepo/hook";
import { type InquirySource as InquirySourceType } from "@cocrepo/enum";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	InquirySourceSelect as BaseInquirySourceSelect,
	type InquirySourceSelectProps as BaseInquirySourceSelectProps,
} from "./InquirySourceSelect";

export interface InquirySourceSelectProps<T>
	extends MobxProps<T>,
		Omit<BaseInquirySourceSelectProps, "value" | "onChange"> {}

export const InquirySourceSelect = observer(
	<T extends object>(props: InquirySourceSelectProps<T>) => {
		const { path, state, ...rest } = props;

		const initialValue = tools.get(state, path) || "ONLINE";

		const formField = useFormField({
			value: initialValue,
			state,
			path,
		});

		const handleChange = (value: InquirySourceType) => {
			formField.setValue(value);
		};

		return (
			<BaseInquirySourceSelect
				{...rest}
				value={formField.state.value as InquirySourceType}
				onChange={handleChange}
			/>
		);
	},
);

export type { BaseInquirySourceSelectProps as PureInquirySourceSelectProps };
export { InquirySourceSelect as PureInquirySourceSelect } from "./InquirySourceSelect";

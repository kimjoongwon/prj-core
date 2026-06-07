import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { ListBoxSelect as BaseListBoxSelect } from "./ListBoxSelect";
import type {
	ListBoxSelectProps as BaseListBoxSelectProps,
	ListBoxSelectValue,
} from "./ListBoxSelect.props";

export interface ListBoxSelectProps<T>
	extends MobxProps<T>,
		Omit<BaseListBoxSelectProps, "value" | "defaultValue" | "onChange"> {}

export const ListBoxSelect = observer(
	<T extends object>(props: ListBoxSelectProps<T>) => {
		const { state, path, selectionMode = "multiple", options, ...rest } = props;

		const value = tools.get(state, path) as ListBoxSelectValue;

		const formField = useFormField<T, ListBoxSelectValue>({
			value,
			state,
			path,
		});

		const handleChange = (nextValue: ListBoxSelectValue) => {
			formField.setValue(nextValue);
		};

		return (
			<BaseListBoxSelect
				{...rest}
				options={options}
				selectionMode={selectionMode}
				value={formField.state.value}
				onChange={handleChange}
			/>
		);
	},
);

import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useFormField } from "@shared/hooks";
import { Tool } from "@shared/utils";
import { MobxProps } from "../../../types";
import {
	MultiSelect as MultiSelectComponent,
	MultiSelectProps as BaseMultiSelectProps,
} from "./MultiSelect";

export interface MultiSelectProps<T>
	extends MobxProps<T>,
		Omit<BaseMultiSelectProps<T>, "selectedKeys" | "onChange"> {}

export const MultiSelect = observer(
	<T extends object>(props: MultiSelectProps<T>) => {
		const { state, path, ...rest } = props;

		const initialValue = Tool.get(state, path) || [];
		const { localState } = useFormField({ initialValue, state, path });

		const handleChange = action((e: React.ChangeEvent<HTMLSelectElement>) => {
			const newValue = e.target.value?.split(",") || [];
			localState.value = newValue;
		});

		return (
			<MultiSelectComponent
				{...rest}
				selectedKeys={new Set(localState.value)}
				onChange={handleChange}
			/>
		);
	},
);

import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	ListboxSelect as BaseListboxSelect,
	ListboxSelectProps as BaseListboxSelectProps,
	ListboxWrapper,
} from "./ListboxSelect";

export interface ListboxSelectProps<T>
	extends MobxProps<T>,
		Omit<
			BaseListboxSelectProps<T>,
			"defaultSelectedKeys" | "onSelectionChange"
		> {}

export const ListboxSelect = observer(
	<T extends object>(props: ListboxSelectProps<T>) => {
		const { state, path, selectionMode = "multiple", ...rest } = props;

		const value = tools.get(state, path);
		const defaultSelectedKeys = new Set([value]);

		const formField = useFormField<any, any>({
			value: defaultSelectedKeys,
			state,
			path,
		});

		const handleSelectionChange: BaseListboxSelectProps<T>["onSelectionChange"] =
			(selection) => {
				const selectedKeys = Array.from(selection);
				if (selectionMode === "single") {
					formField.setValue(selectedKeys[0]);
					return;
				}
				formField.setValue(selectedKeys);
			};

		return (
			<BaseListboxSelect
				{...rest}
				selectionMode={selectionMode}
				defaultSelectedKeys={formField.state.value}
				onSelectionChange={handleSelectionChange}
			/>
		);
	},
);

export { ListboxWrapper };

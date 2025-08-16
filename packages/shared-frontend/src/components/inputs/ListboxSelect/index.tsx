import { get } from "lodash-es";
import { observer } from "mobx-react-lite";
import { useFormField } from "@shared/hooks";
import { MobxProps } from "../../../types";
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
		const {
			state = {},
			path = "",
			selectionMode = "multiple",
			...rest
		} = props;

		const initialValue = get(state, path);
		const defaultSelectedKeys = new Set([initialValue]);

		const { localState } = useFormField({
			initialValue: defaultSelectedKeys,
			state,
			path,
		});

		const handleSelectionChange: BaseListboxSelectProps<T>["onSelectionChange"] =
			(selection) => {
				const selectedKeys = Array.from(selection);
				if (selectionMode === "single") {
					localState.value = selectedKeys[0];
					return;
				}
				localState.value = selectedKeys;
			};

		return (
			<BaseListboxSelect
				{...rest}
				selectionMode={selectionMode}
				defaultSelectedKeys={localState.value}
				onSelectionChange={handleSelectionChange}
			/>
		);
	},
);

export { ListboxWrapper };

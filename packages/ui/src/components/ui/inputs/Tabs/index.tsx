import { useFormField } from "@cocrepo/hook";
import { MobxProps } from "@cocrepo/type";
import { tools } from "@cocrepo/toolkit";
import { observer } from "mobx-react-lite";
import { Key } from "react";
import { Tabs as BaseTabs, type TabsProps as BaseTabsProps } from "./Tabs";

export interface TabsProps<T>
	extends MobxProps<T>,
		Omit<BaseTabsProps, "selectedKey" | "onSelectionChange"> {}

export const Tabs = observer(<T,>(props: TabsProps<T>) => {
	const { state, path, options } = props;

	const formField = useFormField({
		value: tools.get(state, path),
		state,
		path,
	});

	const handleSelectionChange = (key: Key) => {
		formField.setValue(key);
	};

	return (
		<BaseTabs
			options={options}
			selectedKey={String(formField.state.value)}
			onSelectionChange={handleSelectionChange}
		/>
	);
});

// Re-export types for backwards compatibility
export type { BaseTabsProps as PureTabsProps };

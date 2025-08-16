import { get } from "lodash-es";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { Key } from "react";
import { useFormField } from "@shared/hooks";
import { MobxProps } from "../../../types";
import { Tabs as BaseTabs, type TabsProps as BaseTabsProps } from "./Tabs";

export interface TabsProps<T>
	extends MobxProps<T>,
		Omit<BaseTabsProps, "selectedKey" | "onSelectionChange"> {}

export const Tabs = observer(<T,>(props: TabsProps<T>) => {
	const { state, path = "", options } = props;

	const { localState } = useFormField({
		initialValue: get(state, path),
		state,
		path,
	});

	const handleSelectionChange = action((key: Key) => {
		localState.value = key;
	});

	return (
		<BaseTabs
			options={options}
			selectedKey={String(localState.value)}
			onSelectionChange={handleSelectionChange}
		/>
	);
});

// Re-export types for backwards compatibility
export type { BaseTabsProps as PureTabsProps };

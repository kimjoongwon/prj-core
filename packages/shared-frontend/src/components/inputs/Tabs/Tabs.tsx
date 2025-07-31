import type { MobxProps, Option } from "../../../types";

export interface TabsProps<T> extends MobxProps<T> {
	options: Option[];
}

import { get } from "lodash-es";
import { Key } from "react";
import { useMobxHookForm } from "../../../hooks";
import { TabsView } from "./TabsView";

export const Tabs = <T,>(props: TabsProps<T>) => {
	const { state, path = "" } = props;
	const value = get(state, path);
	const { localState } = useMobxHookForm(get(state, path), state, path);

	const onSelectionChange = (key: Key) => {
		localState.value = key;
	};

	return (
		<TabsView value={value} {...props} onSelectionChange={onSelectionChange} />
	);
};

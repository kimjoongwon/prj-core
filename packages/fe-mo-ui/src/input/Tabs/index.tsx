"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	PureTabs,
	type PureTabsProps,
	type TabsOption,
	tabsClassNames,
	useTabs,
	useTabsMeasurements,
	useTabsTrigger,
} from "./Tabs";

export interface TabsProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<PureTabsProps, "onSelectionChange" | "selectedKey"> {}

const Tabs = observer(<TState extends object>(props: TabsProps<TState>) => {
	const { options = [], path, state, ...rest } = props;
	const fallback = options[0]?.value ?? "";
	const field = useFormField<TState, string>({
		path,
		state,
		value: (tools.get(state, path) ?? fallback) as string,
	});

	return (
		<PureTabs
			{...rest}
			onSelectionChange={field.setValue}
			options={options}
			selectedKey={field.state.value}
		/>
	);
});
Tabs.displayName = "Tabs";

const TabsWithStatics = Object.assign(Tabs, {
	Content: PureTabs.Content,
	Indicator: PureTabs.Indicator,
	Label: PureTabs.Label,
	List: PureTabs.List,
	ScrollView: PureTabs.ScrollView,
	Separator: PureTabs.Separator,
	Trigger: PureTabs.Trigger,
}) as typeof Tabs &
	Pick<
		typeof PureTabs,
		| "Content"
		| "Indicator"
		| "Label"
		| "List"
		| "ScrollView"
		| "Separator"
		| "Trigger"
	>;
export { TabsWithStatics as Tabs };
export { tabsClassNames, useTabs, useTabsMeasurements, useTabsTrigger };
export type { PureTabsProps, TabsOption };

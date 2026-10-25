"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import type { MobxProps, Paths } from "@cocrepo/type";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import {
	PureTabs,
	type PureTabsProps,
	type TabsOption,
	tabsClassNames,
	useTabs,
	useTabsMeasurements,
	useTabsTrigger,
} from "./Tabs";
import { useRegisterInputState } from "../input-state-inspection";

type BoundTabsProps<TState extends object> = MobxProps<TState> &
	(Omit<PureTabsProps, "onSelectionChange" | "selectedKey"> & {
		selectedKey?: never;
		defaultValue?: string;
		onSelectionChange?: PureTabsProps["onSelectionChange"];
	});
type UnboundTabsProps = Omit<
	PureTabsProps,
	"onSelectionChange" | "selectedKey"
> & {
	state?: never;
	path?: never;
	selectedKey?: string;
	defaultValue?: string;
	onSelectionChange?: PureTabsProps["onSelectionChange"];
};
export type TabsProps<TState extends object = Record<string, unknown>> =
	| BoundTabsProps<TState>
	| UnboundTabsProps;
export function createTabsState(value = "") {
	const state = {
		value,
		setValue(nextValue: string) {
			state.value = nextValue;
		},
	};
	return makeAutoObservable(state, {}, { autoBind: true, name: "TabsState" });
}
export type TabsState = ReturnType<typeof createTabsState>;

const Tabs = observer(<TState extends object>(props: TabsProps<TState>) => {
	const {
		defaultValue,
		onSelectionChange,
		options = [],
		path,
		selectedKey: controlledValue,
		state,
		...rest
	} = props;
	const fallback = defaultValue ?? options[0]?.value ?? "";
	const localState = useLocalObservable(() => createTabsState(fallback));
	const field = useFormField<TState, string>({
		path: (state && path ? path : "value") as Paths<TState, 4>,
		state: (state ?? localState) as TState,
		defaultValue: fallback,
	});
	const isBound = state !== undefined && path !== undefined;
	const isControlled = !isBound && controlledValue !== undefined;
	const selectedKey = isControlled ? controlledValue : field.state.value;
	useRegisterInputState(
		() => (isControlled ? controlledValue : field.state.value),
		isControlled ? controlledValue : field.state.value,
	);

	return (
		<PureTabs
			{...rest}
			onSelectionChange={(nextValue) => {
				if (!isControlled) field.setValue(nextValue);
				onSelectionChange?.(nextValue);
			}}
			options={options}
			selectedKey={selectedKey}
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

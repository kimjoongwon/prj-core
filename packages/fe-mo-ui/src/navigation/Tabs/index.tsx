import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import {
	Tabs as HeroTabs,
	tabsClassNames,
	useTabs,
	useTabsMeasurements,
	useTabsTrigger,
} from "heroui-native";
import { observer } from "mobx-react-lite";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
	type ReactNode,
} from "react";

type HeroTabsProps = ComponentPropsWithoutRef<typeof HeroTabs>;
export interface TabsOption {
	isDisabled?: boolean;
	text: ReactNode;
	value: string;
}
export interface PureTabsProps
	extends Omit<HeroTabsProps, "children" | "onValueChange" | "value"> {
	children?: ReactNode;
	onSelectionChange?: (value: string) => void;
	options?: TabsOption[];
	selectedKey?: string;
}
const PureTabsComponent = forwardRef<
	ComponentRef<typeof HeroTabs>,
	PureTabsProps
>(
	(
		{ children, onSelectionChange, options = [], selectedKey, ...rest },
		ref,
	) => {
		const handleSelectionChange = onSelectionChange ?? (() => undefined);
		const defaultChildren = (
			<HeroTabs.List key="list">
				{options.map((option: TabsOption) => (
					<HeroTabs.Trigger
						isDisabled={option.isDisabled}
						key={option.value}
						value={option.value}
					>
						<HeroTabs.Label>{option.text}</HeroTabs.Label>
					</HeroTabs.Trigger>
				))}
			</HeroTabs.List>
		);
		return (
			<HeroTabs
				{...rest}
				onValueChange={handleSelectionChange}
				ref={ref}
				value={selectedKey ?? ""}
			>
				{children ?? defaultChildren}
			</HeroTabs>
		);
	},
);
PureTabsComponent.displayName = "PureTabs";
export interface TabsProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<PureTabsProps, "onSelectionChange" | "selectedKey"> {}
const TabsComponent = observer(
	<TState extends object>(props: TabsProps<TState>) => {
		const { options = [], path, state, ...rest } = props;
		const fallback = options[0]?.value ?? "";
		const field = useFormField<TState, string>({
			path,
			state,
			value: (tools.get(state, path) ?? fallback) as string,
		});
		return (
			<PureTabsComponent
				{...rest}
				onSelectionChange={field.setValue}
				options={options}
				selectedKey={field.state.value}
			/>
		);
	},
);
TabsComponent.displayName = "Tabs";
export const Tabs = Object.assign(TabsComponent, {
	Content: HeroTabs.Content,
	Indicator: HeroTabs.Indicator,
	Label: HeroTabs.Label,
	List: HeroTabs.List,
	ScrollView: HeroTabs.ScrollView,
	Separator: HeroTabs.Separator,
	Trigger: HeroTabs.Trigger,
}) as typeof TabsComponent &
	Pick<
		typeof HeroTabs,
		| "Content"
		| "Indicator"
		| "Label"
		| "List"
		| "ScrollView"
		| "Separator"
		| "Trigger"
	>;
export { tabsClassNames, useTabs, useTabsMeasurements, useTabsTrigger };

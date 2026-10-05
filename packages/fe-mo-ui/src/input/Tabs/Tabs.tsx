import {
	Tabs as HeroTabs,
	tabsClassNames,
	useTabs,
	useTabsMeasurements,
	useTabsTrigger,
} from "heroui-native";
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

export const PureTabs = Object.assign(PureTabsComponent, {
	Content: HeroTabs.Content,
	Indicator: HeroTabs.Indicator,
	Label: HeroTabs.Label,
	List: HeroTabs.List,
	ScrollView: HeroTabs.ScrollView,
	Separator: HeroTabs.Separator,
	Trigger: HeroTabs.Trigger,
}) as typeof PureTabsComponent &
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
export const Tabs = PureTabs;
export type TabsProps = PureTabsProps;
export { tabsClassNames, useTabs, useTabsMeasurements, useTabsTrigger };

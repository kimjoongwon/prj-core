import { Option } from "@cocrepo/type";
import { Tabs as HeroUITabs, Tab } from "@heroui/react";
import { Key } from "react";

export interface TabsProps {
	options: Option[];
	selectedKey?: string;
	onSelectionChange?: (key: Key) => void;
}

export const Tabs = (props: TabsProps) => {
	const { options, selectedKey, onSelectionChange } = props;

	return (
		<HeroUITabs selectedKey={selectedKey} onSelectionChange={onSelectionChange}>
			{options?.map((item) => (
				<Tab key={item.value} title={item.text} value={item.value} />
			))}
		</HeroUITabs>
	);
};

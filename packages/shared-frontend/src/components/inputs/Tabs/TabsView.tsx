import { Tab, Tabs, TabsProps } from "@heroui/react";
import { Option } from "@shared/types";
import { observer } from "mobx-react-lite";

export interface TabsViewProps extends TabsProps {
	options: Option[];
	value: any;
}

export const TabsView = observer((props: TabsViewProps) => {
	const { options, value, onSelectionChange } = props;

	return (
		<Tabs selectedKey={value} onSelectionChange={onSelectionChange}>
			{options?.map((item) => (
				<Tab key={item.value} title={item.text} />
			))}
		</Tabs>
	);
});

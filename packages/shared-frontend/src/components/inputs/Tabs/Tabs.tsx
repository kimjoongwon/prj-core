import { Tabs as HeroUITabs, Tab } from "@heroui/react";
import { get } from "lodash-es";
import { observer } from "mobx-react-lite";
import { Key } from "react";
import { useFormField } from "@shared/hooks";
import type { MobxProps, Option } from "../../../types";

export interface TabsProps<T> extends MobxProps<T> {
	options: Option[];
}

export const Tabs = observer(<T,>(props: TabsProps<T>) => {
	const { state, path = "", options } = props;
	const value = get(state, path);
	const { localState } = useFormField({ initialValue: get(state, path), state, path });

	const handleSelectionChange = (key: Key) => {
		localState.value = key;
	};

	return (
		<HeroUITabs
			selectedKey={String(value)}
			onSelectionChange={handleSelectionChange}
		>
			{options?.map((item) => (
				<Tab key={item.value} title={item.label} />
			))}
		</HeroUITabs>
	);
});

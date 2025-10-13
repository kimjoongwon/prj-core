import type { ListboxProps as HeroListboxProps } from "@heroui/react";
import { Listbox as HeroListbox, ListboxItem } from "@heroui/react";

export type ListboxSelectProps<T> = Omit<
	HeroListboxProps,
	"state" | "children"
> & {
	title?: string;
	options:
		| {
				text: string;
				value: any;
		  }[]
		| undefined;
};

import { ReactNode } from "react";
import { Text } from "../../ui";

export const ListboxSelect = <T extends object>(
	props: ListboxSelectProps<T>,
) => {
	const {
		options = [],
		selectionMode = "multiple",
		title,
		defaultSelectedKeys,
		onSelectionChange,
		...rest
	} = props;

	const handleSelectionChange: ListboxSelectProps<T>["onSelectionChange"] = (
		selection,
	) => {
		return selection;
	};

	return (
		<ListboxWrapper>
			{title && (
				<div className="mb-3">
					<Text variant="h6" className="font-semibold">
						{title}
					</Text>
				</div>
			)}
			<HeroListbox
				{...rest}
				className="w-full"
				selectionMode={selectionMode}
				items={options}
				variant="flat"
				classNames={{
					list: "max-h-[300px] overflow-scroll",
				}}
				defaultSelectedKeys={defaultSelectedKeys}
				onSelectionChange={onSelectionChange || handleSelectionChange}
			>
				{(item) => {
					return (
						<ListboxItem className="w-full" key={item.value}>
							{item.text}
						</ListboxItem>
					);
				}}
			</HeroListbox>
		</ListboxWrapper>
	);
};

export const ListboxWrapper = ({ children }: { children: ReactNode }) => (
	<div className="w-full rounded-small border-default-200 border-small px-2 py-2 dark:border-default-100">
		{children}
	</div>
);

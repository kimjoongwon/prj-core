import type { ReactNode } from "react";

export interface ListProps<T> {
	data: T[];
	renderItem: (item: T) => ReactNode;
	horizontal?: boolean;
	className?: string;
	placeholder?: ReactNode;
}

import { v4 } from "uuid";

export const List = <T extends object>(props: ListProps<T>) => {
	const { data, renderItem, placeholder } = props;

	const renderContainer = (children: ReactNode) => {
		return <div key={v4()}>{children}</div>;
	};

	if (data.length === 0) {
		return placeholder;
	}

	return renderContainer(data.map(renderItem));
};

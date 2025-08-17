import type { ReactNode } from "react";
import { v4 } from "uuid";

export interface ListProps<T> {
	data: T[];
	renderItem: (item: T, index: number) => ReactNode;
	horizontal?: boolean;
	className?: string;
	placeholder?: ReactNode;
	gap?: number | string;
	itemClassName?: string;
}

export const List = <T extends object>(props: ListProps<T>) => {
	const {
		data,
		renderItem,
		horizontal = false,
		className = "",
		placeholder,
		gap = "0.5rem",
		itemClassName = "",
	} = props;

	if (data.length === 0) {
		return placeholder ? <div className={className}>{placeholder}</div> : null;
	}

	const containerStyle: React.CSSProperties = {
		display: "flex",
		flexDirection: horizontal ? "row" : "column",
		gap: gap,
		...(horizontal && {
			overflowX: "auto",
			alignItems: "flex-start",
		}),
	};

	const containerClasses = `list-container ${className}`.trim();

	return (
		<div className={containerClasses} style={containerStyle}>
			{data.map((item, index) => (
				<div key={v4()} className={itemClassName}>
					{renderItem(item, index)}
				</div>
			))}
		</div>
	);
};

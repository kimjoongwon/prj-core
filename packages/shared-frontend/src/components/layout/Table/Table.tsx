import type { ReactNode } from "react";

export interface TableLayoutProps {
	children: ReactNode;
}


import { VStack } from "../../ui/VStack/VStack";

export const TableLayout = ((props: TableLayoutProps) => {
	const { children } = props;
	return <VStack className="p-4">{children}</VStack>;
});

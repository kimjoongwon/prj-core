import type { ReactNode } from "react";

export interface TableLayoutProps {
	children: ReactNode;
}

import { observer } from "mobx-react-lite";
import { VStack } from "../../ui/VStack/VStack";

export const TableLayout = observer((props: TableLayoutProps) => {
	const { children } = props;
	return <VStack className="p-4">{children}</VStack>;
});

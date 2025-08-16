import type { ReactNode } from "react";

export interface MainLayoutProps {
	children: ReactNode;
}

import { VStack } from "../../ui/VStack/VStack";

export const MainLayout = (props: MainLayoutProps) => {
	const { children } = props;
	return <VStack className="m-4 w-full border-1 rounded-lg">{children}</VStack>;
};

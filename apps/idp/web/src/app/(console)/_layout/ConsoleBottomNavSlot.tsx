"use client";

import { useLayout } from "@cocrepo/hook";
import {
	useConsoleBottomTabStore,
	useConsoleFABStore,
	useConsoleNavigationStore,
} from "@cocrepo/store";
import { BottomNav } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

export const ConsoleBottomNavSlot = observer(function ConsoleBottomNavSlot() {
	const layoutProps = useLayout({
		useNavigationStore: useConsoleNavigationStore,
		useBottomTabStore: useConsoleBottomTabStore,
		useFABStore: useConsoleFABStore,
	});

	return (
		<BottomNav
			items={layoutProps.bottomTabItems}
			activeTabId={layoutProps.activeBottomTabId}
			onTabClick={layoutProps.onBottomTabClick}
		/>
	);
});

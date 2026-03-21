"use client";

import { useLayout } from "@cocrepo/hook";
import { BottomNav } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import {
	useBottomTabStore,
	useFABStore,
	useNavigationStore,
} from "@/stores/AppStoreProvider";

export const AdminBottomNavSlot = observer(function AdminBottomNavSlot() {
	const layoutProps = useLayout({
		useNavigationStore,
		useBottomTabStore,
		useFABStore,
	});

	return (
		<BottomNav
			items={layoutProps.bottomTabItems}
			activeTabId={layoutProps.activeBottomTabId}
			onTabClick={layoutProps.onBottomTabClick}
		/>
	);
});

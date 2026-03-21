"use client";

import { useLayout } from "@cocrepo/hook";
import { AppLogo, SidePanel } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import {
	useBottomTabStore,
	useFABStore,
	useNavigationStore,
} from "@/stores/AppStoreProvider";

export const AdminSidebarSlot = observer(function AdminSidebarSlot() {
	const layoutProps = useLayout({
		useNavigationStore,
		useBottomTabStore,
		useFABStore,
	});

	return (
		<SidePanel
			navItems={layoutProps.navItems}
			selectedNavItem={layoutProps.selectedNavItem}
			selectedSubNavItem={layoutProps.selectedSubNavItem}
			expandedNavItemIds={layoutProps.expandedNavItemIds}
			onNavItemClick={layoutProps.onNavItemClick}
			onSubNavItemClick={layoutProps.onSubNavItemClick}
			onNavItemToggle={layoutProps.onNavItemToggle}
			logo={<AppLogo icon="LayoutGrid" text="플레이트" />}
		/>
	);
});

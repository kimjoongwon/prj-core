"use client";

import { useLayout } from "@cocrepo/hook";
import {
	useConsoleBottomTabStore,
	useConsoleFABStore,
	useConsoleNavigationStore,
} from "@cocrepo/store";
import { AppLogo, SidePanel } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

export const ConsoleSidebarSlot = observer(function ConsoleSidebarSlot() {
	const layoutProps = useLayout({
		useNavigationStore: useConsoleNavigationStore,
		useBottomTabStore: useConsoleBottomTabStore,
		useFABStore: useConsoleFABStore,
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
			logo={<AppLogo icon="KeyRound" text="IDP 관리" />}
		/>
	);
});

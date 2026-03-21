"use client";

import { useLayout } from "@cocrepo/hook";
import { OverlayMenu } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import {
	useBottomTabStore,
	useFABStore,
	useNavigationStore,
} from "@/stores/AppStoreProvider";

export const AdminOverlayMenuSlot = observer(function AdminOverlayMenuSlot() {
	const layoutProps = useLayout({
		useNavigationStore,
		useBottomTabStore,
		useFABStore,
	});

	if (!layoutProps.isSubMenuOpen) {
		return null;
	}

	return (
		<OverlayMenu
			title={layoutProps.subMenuTitle}
			items={layoutProps.subMenuItems}
			selectedItemId={layoutProps.selectedSubNavItem?.id ?? null}
			onItemClick={layoutProps.onSubNavItemClick}
			onClose={layoutProps.onSubMenuClose}
		/>
	);
});

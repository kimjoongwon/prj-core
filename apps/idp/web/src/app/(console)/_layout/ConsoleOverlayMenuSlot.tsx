"use client";

import { useLayout } from "@cocrepo/hook";
import {
	useConsoleBottomTabStore,
	useConsoleFABStore,
	useConsoleNavigationStore,
} from "@cocrepo/store";
import { OverlayMenu } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

export const ConsoleOverlayMenuSlot = observer(
	function ConsoleOverlayMenuSlot() {
		const layoutProps = useLayout({
			useNavigationStore: useConsoleNavigationStore,
			useBottomTabStore: useConsoleBottomTabStore,
			useFABStore: useConsoleFABStore,
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
	},
);

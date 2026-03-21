"use client";

import { useLayout } from "@cocrepo/hook";
import { ActionFab } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import {
	useBottomTabStore,
	useFABStore,
	useNavigationStore,
} from "@/stores/AppStoreProvider";

export const AdminFabSlot = observer(function AdminFabSlot() {
	const layoutProps = useLayout({
		useNavigationStore,
		useBottomTabStore,
		useFABStore,
	});

	if (layoutProps.fabActions.length === 0) {
		return null;
	}

	return (
		<ActionFab
			isOpen={layoutProps.isFABOpen}
			actions={layoutProps.fabActions}
			onToggle={layoutProps.onFABToggle}
			onActionClick={layoutProps.onFABActionClick}
		/>
	);
});

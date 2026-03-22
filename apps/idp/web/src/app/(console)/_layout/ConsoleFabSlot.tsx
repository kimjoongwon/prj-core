"use client";

import { useLayout } from "@cocrepo/hook";
import {
	useConsoleBottomTabStore,
	useConsoleFABStore,
	useConsoleNavigationStore,
} from "@cocrepo/store";
import { ActionFab } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

export const ConsoleFabSlot = observer(function ConsoleFabSlot() {
	const layoutProps = useLayout({
		useNavigationStore: useConsoleNavigationStore,
		useBottomTabStore: useConsoleBottomTabStore,
		useFABStore: useConsoleFABStore,
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

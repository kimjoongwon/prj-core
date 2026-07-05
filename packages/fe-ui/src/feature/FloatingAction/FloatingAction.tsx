"use client";

import { useLayout } from "@cocrepo/hook";
import { observer } from "mobx-react-lite";
import { ActionFab } from "../../widget/ActionFab";

/**
 * mobile floating action button을 store 상태에 연결해 렌더링합니다.
 */
export const FloatingAction = observer(function FloatingAction() {
	const layoutProps = useLayout();

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

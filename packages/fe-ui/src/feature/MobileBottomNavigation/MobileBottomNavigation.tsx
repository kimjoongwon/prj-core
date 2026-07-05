"use client";

import { useLayout } from "@cocrepo/hook";
import { observer } from "mobx-react-lite";
import { BottomNav } from "../../widget/BottomNav";

/**
 * mobile bottom navigation을 store 상태에 연결해 렌더링합니다.
 */
export const MobileBottomNavigation = observer(
	function MobileBottomNavigation() {
		const layoutProps = useLayout();

		return (
			<BottomNav
				items={layoutProps.bottomTabItems}
				activeTabId={layoutProps.activeBottomTabId}
				onTabClick={layoutProps.onBottomTabClick}
			/>
		);
	},
);

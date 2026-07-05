"use client";

import { useLayout } from "@cocrepo/hook";
import { observer } from "mobx-react-lite";
import { OverlayMenu } from "../../widget/OverlayMenu";

/**
 * mobile submenu overlay를 store 상태에 연결해 렌더링합니다.
 */
export const MobileMenu = observer(function MobileMenu() {
	const layoutProps = useLayout();

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

import type { ReactNode } from "react";
import { Layout } from "@cocrepo/ui";
import { AdminBottomNavSlot } from "./_layout/AdminBottomNavSlot";
import { AdminFabSlot } from "./_layout/AdminFabSlot";
import { AdminHeaderSlot } from "./_layout/AdminHeaderSlot";
import { AdminLayoutEffects } from "./_layout/AdminLayoutEffects";
import { AdminOverlayMenuSlot } from "./_layout/AdminOverlayMenuSlot";
import { AdminSidebarSlot } from "./_layout/AdminSidebarSlot";

/**
 * Admin route skeleton
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<AdminLayoutEffects />
			<Layout
				desktopVariant="stacked-header"
				header={<AdminHeaderSlot />}
				sidebar={<AdminSidebarSlot />}
				mobileOverlayMenu={<AdminOverlayMenuSlot />}
				mobileFab={<AdminFabSlot />}
				mobileBottomNav={<AdminBottomNavSlot />}
			>
				{children}
			</Layout>
		</>
	);
}

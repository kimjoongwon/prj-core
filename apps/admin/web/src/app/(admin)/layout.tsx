import { Layout } from "@cocrepo/ui";
import type { ReactNode } from "react";
import { AdminBottomNavSlot } from "./_layout/AdminBottomNavSlot";
import { AdminFabSlot } from "./_layout/AdminFabSlot";
import { AdminHeaderSlot } from "./_layout/AdminHeaderSlot";
import { AdminLayoutEffects } from "./_layout/AdminLayoutEffects";
import { AdminOverlayMenuSlot } from "./_layout/AdminOverlayMenuSlot";
import { AdminPageAccessGate } from "./_layout/AdminPageAccessGate";
import { AdminSidebarSlot } from "./_layout/AdminSidebarSlot";

export const dynamic = "force-dynamic";

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
				sidebarClassName="md:!w-[264px]"
				mobileOverlayMenu={<AdminOverlayMenuSlot />}
				mobileFab={<AdminFabSlot />}
				mobileBottomNav={<AdminBottomNavSlot />}
			>
				<AdminPageAccessGate>{children}</AdminPageAccessGate>
			</Layout>
		</>
	);
}

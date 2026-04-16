import type { ReactNode } from "react";
import { Layout } from "@cocrepo/ui";
import { ConsoleBottomNavSlot } from "./_layout/ConsoleBottomNavSlot";
import { ConsoleFabSlot } from "./_layout/ConsoleFabSlot";
import { ConsoleHeaderSlot } from "./_layout/ConsoleHeaderSlot";
import { ConsoleLayoutEffects } from "./_layout/ConsoleLayoutEffects";
import { ConsoleOverlayMenuSlot } from "./_layout/ConsoleOverlayMenuSlot";
import { ConsolePageAccessGate } from "./_layout/ConsolePageAccessGate";
import { ConsoleSidebarSlot } from "./_layout/ConsoleSidebarSlot";
import ConsoleSessionGate from "./_session-gate";

interface ConsoleLayoutProps {
	children: ReactNode;
}

export default function ConsoleLayout({ children }: ConsoleLayoutProps) {
	return (
		<ConsoleSessionGate>
			<ConsoleLayoutEffects />
			<Layout
				desktopVariant="stacked-header"
				header={<ConsoleHeaderSlot />}
				sidebar={<ConsoleSidebarSlot />}
				mobileOverlayMenu={<ConsoleOverlayMenuSlot />}
				mobileFab={<ConsoleFabSlot />}
				mobileBottomNav={<ConsoleBottomNavSlot />}
			>
				<ConsolePageAccessGate>{children}</ConsolePageAccessGate>
			</Layout>
		</ConsoleSessionGate>
	);
}

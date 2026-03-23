import type { ReactNode } from "react";
import { Layout } from "@cocrepo/ui";
import { ConsoleBottomNavSlot } from "./_layout/ConsoleBottomNavSlot";
import { ConsoleFabSlot } from "./_layout/ConsoleFabSlot";
import { ConsoleHeaderSlot } from "./_layout/ConsoleHeaderSlot";
import { ConsoleOverlayMenuSlot } from "./_layout/ConsoleOverlayMenuSlot";
import { ConsoleSidebarSlot } from "./_layout/ConsoleSidebarSlot";
import ConsoleSessionGate from "./_session-gate";

interface ConsoleLayoutProps {
	children: ReactNode;
}

export default function ConsoleLayout({ children }: ConsoleLayoutProps) {
	return (
		<ConsoleSessionGate>
			<Layout
				desktopVariant="stacked-header"
				header={<ConsoleHeaderSlot />}
				sidebar={<ConsoleSidebarSlot />}
				mobileOverlayMenu={<ConsoleOverlayMenuSlot />}
				mobileFab={<ConsoleFabSlot />}
				mobileBottomNav={<ConsoleBottomNavSlot />}
			>
				{children}
			</Layout>
		</ConsoleSessionGate>
	);
}

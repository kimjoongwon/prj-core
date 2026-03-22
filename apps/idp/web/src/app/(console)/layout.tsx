import type { ReactNode } from "react";
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
			<div className="flex h-screen bg-background">
				<div className="hidden md:block">
					<ConsoleSidebarSlot />
				</div>
				<div className="flex flex-1 flex-col overflow-hidden">
					<ConsoleHeaderSlot />
					<main className="flex-1 overflow-y-auto bg-content2 p-4 pb-20 md:p-6 md:pb-6">
						{children}
					</main>
				</div>
				<ConsoleOverlayMenuSlot />
				<ConsoleFabSlot />
				<ConsoleBottomNavSlot />
			</div>
		</ConsoleSessionGate>
	);
}

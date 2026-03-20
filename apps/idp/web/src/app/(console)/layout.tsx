import type { ReactNode } from "react";
import ConsoleSessionGate from "./_session-gate";
import ConsoleLayoutClient from "./_client";

interface ConsoleLayoutProps {
	children: ReactNode;
}

export default function ConsoleLayout({ children }: ConsoleLayoutProps) {
	return (
		<ConsoleSessionGate>
			<ConsoleLayoutClient>{children}</ConsoleLayoutClient>
		</ConsoleSessionGate>
	);
}

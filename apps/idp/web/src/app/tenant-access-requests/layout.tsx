import type { ReactNode } from "react";
import ConsoleSessionGate from "../(console)/_session-gate";

interface TenantAccessRequestsLayoutProps {
	children: ReactNode;
}

export default function TenantAccessRequestsLayout({
	children,
}: TenantAccessRequestsLayoutProps) {
	return (
		<ConsoleSessionGate>
			<main className="min-h-screen bg-background px-4 py-6 text-foreground md:px-8">
				<div className="mx-auto max-w-5xl">{children}</div>
			</main>
		</ConsoleSessionGate>
	);
}

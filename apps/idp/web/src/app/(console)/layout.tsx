"use client";

import { Spinner } from "@heroui/react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { hasIdpBrowserSessionCookie } from "@/lib/browser-auth";
import ConsoleLayoutClient from "./_client";

interface ConsoleLayoutProps {
	children: ReactNode;
}

export default function ConsoleLayout({ children }: ConsoleLayoutProps) {
	const [hasSession, setHasSession] = useState<boolean | null>(null);

	useEffect(() => {
		const nextHasSession = hasIdpBrowserSessionCookie();
		setHasSession(nextHasSession);

		if (!nextHasSession) {
			const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
			window.location.replace(
				`/auth/login?returnTo=${encodeURIComponent(returnTo)}`,
			);
		}
	}, []);

	if (!hasSession) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Spinner size="lg" />
			</div>
		);
	}

	return <ConsoleLayoutClient>{children}</ConsoleLayoutClient>;
}

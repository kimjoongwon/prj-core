"use client";

import { Spinner } from "@heroui/react";
import { useEffect } from "react";
import { hasIdpBrowserSessionCookie } from "@/lib/browser-auth";

export default function HomePage() {
	useEffect(() => {
		const nextPath = hasIdpBrowserSessionCookie()
			? "/dashboard"
			: "/auth/login";
		window.location.replace(nextPath);
	}, []);

	return (
		<div className="flex min-h-screen items-center justify-center">
			<Spinner size="lg" />
		</div>
	);
}

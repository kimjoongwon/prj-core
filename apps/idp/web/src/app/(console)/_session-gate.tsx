"use client";

import { useVerifyToken } from "@cocrepo/api/idp/auth";
import { Spinner } from "@cocrepo/ui";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

interface ConsoleSessionGateProps {
	children: ReactNode;
}

function getReturnTo() {
	if (typeof window === "undefined") {
		return "/";
	}

	return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

export default function ConsoleSessionGate({
	children,
}: ConsoleSessionGateProps) {
	const router = useRouter();
	const { data, isPending } = useVerifyToken({
		query: {
			retry: false,
			refetchOnWindowFocus: false,
		},
	});

	const hasSession = data?.data?.valid === true;

	useEffect(() => {
		if (isPending || hasSession) {
			return;
		}

		router.replace(`/auth/login?returnTo=${encodeURIComponent(getReturnTo())}`);
	}, [hasSession, isPending, router]);

	if (isPending || !hasSession) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Spinner size="lg" />
			</div>
		);
	}

	return <>{children}</>;
}

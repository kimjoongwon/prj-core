"use client";

import { useVerifyToken } from "@cocrepo/api/idp/auth";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomeRedirectClient() {
	const router = useRouter();
	const { data, isPending } = useVerifyToken({
		query: {
			retry: false,
			refetchOnWindowFocus: false,
		},
	});

	const hasSession = data?.data?.valid === true;

	useEffect(() => {
		if (isPending) {
			return;
		}

		router.replace(hasSession ? "/dashboard" : "/auth/login");
	}, [hasSession, isPending, router]);

	return (
		<div className="flex min-h-screen items-center justify-center">
			<Spinner size="lg" />
		</div>
	);
}

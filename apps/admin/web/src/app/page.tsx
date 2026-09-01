"use client";

import { useVerifyToken } from "@cocrepo/api/core/auth";
import { SessionCheckScreen } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomePage = observer(function HomePage() {
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
		<SessionCheckScreen
			title="세션 확인 중"
			description="인증 상태를 확인한 뒤 적절한 페이지로 이동합니다."
		/>
	);
});

export default HomePage;

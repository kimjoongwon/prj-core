"use client";

import { useVerifyToken } from "@cocrepo/api/idp/auth";
import {
	DetailPage,
	DetailPageSurface,
	DetailSectionCard,
	PageTitleBar,
} from "@cocrepo/ui";
import { Spinner } from "@heroui/react";
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
		<DetailPage
			top={
				<PageTitleBar
					title="세션 확인 중"
					description="인증 상태를 확인한 뒤 적절한 페이지로 이동합니다."
				/>
			}
		>
			<DetailPageSurface>
				<DetailSectionCard>
					<div className="flex min-h-[320px] items-center justify-center">
						<Spinner size="lg" />
					</div>
				</DetailSectionCard>
			</DetailPageSurface>
		</DetailPage>
	);
});

export default HomePage;

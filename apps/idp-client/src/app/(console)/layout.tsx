"use client";

import { useLogout } from "@cocrepo/api";
import { AdminLayout, AppLogo } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { useIdpLayout } from "@/hooks";

interface ConsoleLayoutWrapperProps {
	children: ReactNode;
}

/**
 * IDP 관리 콘솔 레이아웃
 *
 * AdminLayout을 적용합니다.
 * - Space 선택 UI 없음 (IDP는 시스템 전체 관리)
 * - JWT 인증 체크 (미인증 시 /auth/login으로 리다이렉트)
 */
function ConsoleLayoutWrapper({ children }: ConsoleLayoutWrapperProps) {
	const layoutProps = useIdpLayout();

	const userInfo = {
		name: "IDP 관리자",
		role: "FULL_ACCESS",
	};

	const { mutate: logoutMutate } = useLogout({
		mutation: {
			onSettled: () => {
				window.location.href = "/auth/login";
			},
		},
	});

	const handleLogout = () => {
		logoutMutate();
	};

	return (
		<AdminLayout
			{...layoutProps}
			logo={<AppLogo icon="KeyRound" text="IDP 관리" />}
			userInfo={userInfo}
			onLogout={handleLogout}
		>
			{children}
		</AdminLayout>
	);
}

export default observer(ConsoleLayoutWrapper);

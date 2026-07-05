"use client";

import { useVerifyToken } from "@cocrepo/api/idp/auth";
import {
	ADMIN_PATHS,
	isScopeKindAccessible,
	matchAdminPageAccessItem,
} from "@cocrepo/constant";
import { useApp } from "@cocrepo/store";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useT } from "../../i18n";
import { AccessDeniedScreen } from "../../screen/AccessDeniedScreen/AccessDeniedScreen";

export interface AccessGateProps {
	contents: ReactNode;
}

/**
 * 현재 route 접근 권한을 확인하고 허용된 contents 또는 fallback 화면을 렌더링합니다.
 */
export const AccessGate = observer(function AccessGate({
	contents,
}: AccessGateProps) {
	const pathname = usePathname();
	const router = useRouter();
	const app = useApp();
	const space = app.space;
	const ability = app.ability;
	const t = useT();

	const shouldVerifyCurrentTenant =
		space.isHydrated && space.isSpaceSelectionResolved;
	const { data: verifyTokenResponse, isPending: isVerifyingToken } =
		useVerifyToken({
			query: {
				enabled: shouldVerifyCurrentTenant,
				queryKey: ["/api/v1/auth/verify-token", space.tenantId],
				retry: false,
				refetchOnWindowFocus: false,
			},
		});
	const hasFullAccessRole = verifyTokenResponse?.data?.hasFullAccess === true;

	if (!pathname) {
		return contents;
	}

	const pageAccessItem = matchAdminPageAccessItem(pathname);
	if (!pageAccessItem) {
		return contents;
	}

	if (
		!shouldVerifyCurrentTenant ||
		isVerifyingToken ||
		(!ability.isLoaded && !hasFullAccessRole)
	) {
		return (
			<AccessDeniedScreen
				mode="checking"
				title="권한 확인 중"
				description="현재 화면 접근 권한을 확인하고 있습니다."
			/>
		);
	}

	const isScopeAccessible = isScopeKindAccessible(
		pageAccessItem.scopeKind,
		hasFullAccessRole,
	);

	if (
		isScopeAccessible &&
		(hasFullAccessRole || ability.can("view", pageAccessItem.subject))
	) {
		return contents;
	}

	const forbiddenDescription = isScopeAccessible
		? `${t(pageAccessItem.pageLabel)} ${t("화면을 열 수 있는 화면 접근 권한이 현재 선택한 Space 권한에 없습니다.")}`
		: `${t(pageAccessItem.pageLabel)} ${t("화면은 현재 선택한 tenant role이 PLATFORM_ADMIN일 때만 열 수 있습니다.")}`;

	/**
	 * 접근 권한 fallback에서 이전 화면으로 돌아갑니다.
	 */
	const onClickBackButton = () => {
		router.back();
	};

	/**
	 * 접근 권한 fallback에서 dashboard 화면으로 이동합니다.
	 */
	const onClickDashboardButton = () => {
		router.push(ADMIN_PATHS.DASHBOARD);
	};

	return (
		<AccessDeniedScreen
			mode="forbidden"
			title="접근 권한이 없습니다"
			description={forbiddenDescription}
			isScopeAccessible={isScopeAccessible}
			onClickBackButton={onClickBackButton}
			onClickDashboardButton={onClickDashboardButton}
		/>
	);
});

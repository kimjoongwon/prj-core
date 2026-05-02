"use client";

import { useVerifyToken } from "@cocrepo/api/idp/auth";
import { useLayout } from "@cocrepo/hook";
import {
	useConsoleBottomTabStore,
	useConsoleFABStore,
	useConsoleNavigationStore,
	useConsolePersistStore,
} from "@cocrepo/store";
import { SidePanel, useT } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { IdpConsoleBrand } from "@/components/console/IdpConsoleBrand";
import {
	getIdpConsoleIconName,
	IdpConsoleIcon,
} from "@/components/console/IdpConsoleIcon";

const NAV_ITEM_COPY: Record<string, string> = {
	dashboard: "세션, 실패, 잠금 상태를 빠르게 확인합니다.",
	"oidc-clients": "연동 앱과 인증 흐름 구성을 관리합니다.",
	accounts: "계정 잠금, 복구, 권한 상태를 점검합니다.",
	"oidc-sessions": "세션과 토큰 사용 상태를 추적합니다.",
	"auth-audit-logs": "로그인 흐름과 정책 이벤트를 확인합니다.",
	"security-policy": "비밀번호와 잠금 정책을 조정합니다.",
};

export const ConsoleSidebarSlot = observer(function ConsoleSidebarSlot() {
	const t = useT();
	const persistStore = useConsolePersistStore();
	const shouldVerifyCurrentTenant =
		persistStore.isHydrated && persistStore.isSpaceSelectionResolved;
	const { data: verifyTokenResponse } = useVerifyToken({
		query: {
			enabled: shouldVerifyCurrentTenant,
			retry: false,
			refetchOnWindowFocus: false,
		},
	});
	const hasFullAccessInCurrentTenant =
		verifyTokenResponse?.data?.hasFullAccess === true;
	const layoutProps = useLayout({
		useNavigationStore: useConsoleNavigationStore,
		useBottomTabStore: useConsoleBottomTabStore,
		useFABStore: useConsoleFABStore,
	});

	return (
		<SidePanel
			navItems={layoutProps.navItems}
			selectedNavItem={layoutProps.selectedNavItem}
			selectedSubNavItem={layoutProps.selectedSubNavItem}
			expandedNavItemIds={layoutProps.expandedNavItemIds}
			onNavItemClick={layoutProps.onNavItemClick}
			onSubNavItemClick={layoutProps.onSubNavItemClick}
			onNavItemToggle={layoutProps.onNavItemToggle}
			logo={<IdpConsoleBrand />}
			logoDescription="인증 정책, 계정 접근, OIDC 연동 상태를 한 화면 구조 안에서 관리합니다."
			getItemDescription={(item) =>
				NAV_ITEM_COPY[item.id] ?? "콘솔 기능으로 이동합니다."
			}
			renderItemIcon={(item) => (
				<IdpConsoleIcon name={getIdpConsoleIconName(item.id)} size={19} />
			)}
			footer={
				<>
					<p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
						Identity Console
					</p>
					<p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
						{hasFullAccessInCurrentTenant
							? t("현재 tenant FULL_ACCESS로 전체 리소스를 확인합니다.")
							: t(
									"{{spaceName}} 기준으로 리소스 범위를 제한합니다.",
									undefined,
									{ spaceName: persistStore.groundName || t("현재 Space") },
								)}
					</p>
				</>
			}
		/>
	);
});

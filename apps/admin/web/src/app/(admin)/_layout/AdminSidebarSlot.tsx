"use client";

import { useLayout } from "@cocrepo/hook";
import { AppLogo, SidePanel } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import {
	useBottomTabStore,
	useFABStore,
	useNavigationStore,
	usePersistStore,
} from "@/stores/AppStoreProvider";

const NAV_ITEM_COPY: Record<string, string> = {
	dashboard: "운영 상태와 최근 지표를 빠르게 확인합니다.",
	users: "회원 계정과 상태를 검색하고 조정합니다.",
	spaces: "공간 정보와 노출 구성을 관리합니다.",
	timelines: "예약 가능한 일정과 세션 흐름을 설계합니다.",
	tasks: "운동 태스크와 루틴 자산을 정리합니다.",
	templates: "메시지와 운영 템플릿을 유지합니다.",
	assets: "이미지와 업로드 자산을 추적합니다.",
	inquiries: "고객 문의와 처리 상태를 관리합니다.",
	roles: "권한, 액션, 대상 규칙을 편집합니다.",
};

export const AdminSidebarSlot = observer(function AdminSidebarSlot() {
	const layoutProps = useLayout({
		useNavigationStore,
		useBottomTabStore,
		useFABStore,
	});
	const persistStore = usePersistStore();

	return (
		<SidePanel
			navItems={layoutProps.navItems}
			selectedNavItem={layoutProps.selectedNavItem}
			selectedSubNavItem={layoutProps.selectedSubNavItem}
			expandedNavItemIds={layoutProps.expandedNavItemIds}
			onNavItemClick={layoutProps.onNavItemClick}
			onSubNavItemClick={layoutProps.onSubNavItemClick}
			onNavItemToggle={layoutProps.onNavItemToggle}
			logo={
				<AppLogo
					icon="LayoutGrid"
					text="플레이트"
					subtitle="Operations Console"
					variant="console"
				/>
			}
			logoDescription="회원, 일정, 권한, 고객 운영 흐름을 하나의 콘솔 구조에서 정리합니다."
			getItemDescription={(item) =>
				NAV_ITEM_COPY[item.id] ?? "운영 콘솔 메뉴로 이동합니다."
			}
			footer={
				<>
					<p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
						Current Space
					</p>
					<p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
						{persistStore.groundName ?? "Space를 선택해 운영 범위를 전환합니다."}
					</p>
				</>
			}
		/>
	);
});

"use client";

import { useApp } from "@cocrepo/store";
import { cn } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useT } from "../../../i18n";
import { NavigationPanelItem } from "./NavigationPanelItem";

const NAV_ITEM_COPY: Record<string, string> = {
	dashboard: "운영 상태와 최근 지표를 빠르게 확인합니다.",
	users: "회원 계정과 상태를 검색하고 조정합니다.",
	spaces: "공간 정보와 노출 구성을 관리합니다.",
	timelines: "예약 가능한 일정과 세션 흐름을 설계합니다.",
	tasks: "운동 태스크와 루틴 자산을 정리합니다.",
	routines: "운동 루틴 흐름과 구성을 관리합니다.",
	templates: "메시지와 운영 템플릿을 유지합니다.",
	terms: "서비스 약관과 동의 문서를 관리합니다.",
	assets: "이미지와 업로드 자산을 추적합니다.",
	inquiries: "고객 문의와 처리 상태를 관리합니다.",
	roles: "권한, 액션, 대상 규칙을 편집합니다.",
};

/**
 * desktop navigation panel을 store 상태에 연결해 렌더링합니다.
 */

export const NavigationPanel = observer(function NavigationPanel() {
	const t = useT();
	const navigation = useApp().navigation;

	const getItemDescription = (item: { id: string }) =>
		t(NAV_ITEM_COPY[item.id] ?? "운영 콘솔 메뉴로 이동합니다.");

	const navItems = navigation.items;
	const selectedNavItem = navigation.selectedNavItem;
	const selectedSubNavItem = navigation.selectedSubNavItem;
	const expandedNavItemIds = navigation.expandedNavItemIds;
	const onNavItemClick = (navItemId: string) =>
		navigation.selectNavItem(navItemId);
	const onSubNavItemClick = (subNavItemId: string) =>
		navigation.selectSubNavItem(subNavItemId);
	const onNavItemToggle = (navItemId: string) =>
		navigation.toggleNavItem(navItemId);
	const density = "compact" as const;
	const descriptionVisibility = "active" as const;

	return (
		<aside className="flex h-full flex-col">
			<div
				className={cn(
					"flex min-h-0 flex-1 flex-col overflow-hidden border-separator border-r bg-surface",
				)}
			>
				<nav
					className={cn(
						"flex-1 overflow-y-auto",
						density === "compact" ? "p-2" : "p-3",
					)}
				>
					<div className={density === "compact" ? "space-y-1" : "space-y-2"}>
						{navItems.map((item) => (
							<NavigationPanelItem
								key={item.id}
								item={item}
								isSelected={
									selectedNavItem?.id === item.id && selectedSubNavItem === null
								}
								isActiveBranch={
									selectedNavItem?.id === item.id && selectedSubNavItem !== null
								}
								isExpanded={expandedNavItemIds.has(item.id)}
								selectedSubItemId={selectedSubNavItem?.id ?? null}
								onNavItemClick={onNavItemClick}
								onSubNavItemClick={onSubNavItemClick}
								onToggle={onNavItemToggle}
								density={density}
								descriptionVisibility={descriptionVisibility}
								getItemDescription={getItemDescription}
							/>
						))}
					</div>
				</nav>
			</div>
		</aside>
	);
});

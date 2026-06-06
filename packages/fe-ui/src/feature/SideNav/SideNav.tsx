"use client";

import { useNavigationStore } from "@cocrepo/store";
import { observer } from "mobx-react-lite";
import { NavTreePanel } from "../../widget/NavTreePanel";

export interface SideNavProps {
	/** 사이드바 너비 (기본값: 240px) */
	width?: number;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * SideNav Feature 컴포넌트
 *
 * NavigationStore와 NavTreePanel 위젯을 연결합니다.
 * Store에서 데이터를 가져와 Widget에 주입하는 역할만 담당합니다.
 *
 * **컴포넌트 계층:**
 * - Widget: NavTreePanel (순수 UI, props로 데이터 전달)
 * - Feature: SideNav (Store 연결, 핸들러 정의)
 *
 * @example
 * ```tsx
 * <Page leftAside={<SideNav />}>
 *   {children}
 * </Page>
 * ```
 */
export const SideNav = observer(({ width = 240, className }: SideNavProps) => {
	const navigationStore = useNavigationStore();

	// 현재 펼쳐진 아이템 ID들
	// - 사용자가 수동으로 토글한 아이템 (isNavItemExpanded)
	// - 현재 활성화된 아이템 (item.active) - 페이지 새로고침 시에도 펼쳐짐
	const expandedKeys = (() => {
		const keys = new Set<string>();
		for (const item of navigationStore.items) {
			if (item.hasChildren) {
				// 수동 토글 또는 현재 활성 아이템이면 펼침
				if (navigationStore.isNavItemExpanded(item.id) || item.active) {
					keys.add(item.id);
				}
			}
		}
		return keys;
	})();

	/**
	 * 아이템 펼침/접힘 토글 핸들러
	 */
	const handleToggle = (id: string) => {
		navigationStore.toggleNavItem(id);
	};

	/**
	 * 단독 아이템 선택 핸들러 (하위 아이템이 없는 경우)
	 */
	const handleSelectTreeItem = (id: string) => {
		navigationStore.selectNavItem(id);
	};

	/**
	 * 하위 아이템 선택 핸들러
	 */
	const handleSelectSubItem = (id: string) => {
		navigationStore.selectSubNavItem(id);
	};

	return (
		<NavTreePanel
			items={navigationStore.items}
			expandedKeys={expandedKeys}
			onToggle={handleToggle}
			onSelectTreeItem={handleSelectTreeItem}
			onSelectSubItem={handleSelectSubItem}
			width={width}
			className={className}
		/>
	);
});

SideNav.displayName = "SideNav";

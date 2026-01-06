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
 * <PageLayout leftAside={<SideNav />}>
 *   {children}
 * </PageLayout>
 * ```
 */
export const SideNav = observer(({ width = 240, className }: SideNavProps) => {
	const navigationStore = useNavigationStore();

	// 현재 펼쳐진 아이템 ID들
	// Note: useMemo 대신 직접 계산 - MobX observable 변경 추적을 위해
	const expandedKeys = (() => {
		const keys = new Set<string>();
		for (const item of navigationStore.items) {
			if (item.hasChildren && navigationStore.isNavItemExpanded(item.id)) {
				keys.add(item.id);
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
	const handleSelectItem = (id: string) => {
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
			onSelectItem={handleSelectItem}
			onSelectSubItem={handleSelectSubItem}
			width={width}
			className={className}
		/>
	);
});

SideNav.displayName = "SideNav";

"use client";

import { Tab, Tabs } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import type { Key } from "react";

/**
 * 탭 스타일 프리셋
 */
const TABS_CLASS_NAMES = {
	tabList: "bg-content1 rounded-xl p-1",
	cursor: "bg-primary",
	tab: "px-4 py-2",
	tabContent: "group-data-[selected=true]:text-white",
} as const;

/**
 * 탭 설정 정의
 */
const TAB_ITEMS = [
	{ key: "roles", title: "Role 권한", path: "/roles/abilities/roles" },
	{ key: "users", title: "User 예외 권한", path: "/roles/abilities/users" },
	{ key: "subjects", title: "Subject 관리", path: "/roles/abilities/subjects" },
	{ key: "actions", title: "Action 관리", path: "/roles/abilities/actions" },
	{
		key: "ui-elements",
		title: "UI 가시성",
		path: "/roles/abilities/ui-elements",
	},
] as const;

/**
 * 기본 탭 키
 */
const DEFAULT_TAB_KEY = "roles";

/**
 * 권한 관리 레이아웃
 *
 * URL 기반 탭 네비게이션을 제공합니다.
 * - /roles/abilities/roles - Role 권한
 * - /roles/abilities/users - User 예외 권한
 * - /roles/abilities/subjects - Subject 관리
 * - /roles/abilities/actions - Action 관리
 * - /roles/abilities/ui-elements - UI 가시성
 *
 * PageSurface는 각 Page 컴포넌트에서 담당합니다.
 */
function AbilitiesLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();

	/**
	 * 현재 경로에서 활성 탭 키 추출
	 */
	const getActiveTabKey = (): string => {
		const currentTab = TAB_ITEMS.find((tab) => pathname.startsWith(tab.path));
		return currentTab?.key ?? DEFAULT_TAB_KEY;
	};

	/**
	 * 탭 선택 변경
	 */
	const onChangeTabSelection = (key: Key) => {
		const selectedTab = TAB_ITEMS.find((tab) => tab.key === key);
		if (selectedTab) {
			// Next.js typed routes 우회 - 아직 생성되지 않은 경로 허용
			// biome-ignore lint/suspicious/noExplicitAny: Next.js typed routes 우회
			router.push(selectedTab.path as any);
		}
	};

	const activeKey = getActiveTabKey();

	return (
		<div className="space-y-6">
			{/* 탭 네비게이션 */}
			<Tabs
				aria-label="권한 관리 탭"
				classNames={TABS_CLASS_NAMES}
				selectedKey={activeKey}
				onSelectionChange={onChangeTabSelection}
			>
				{TAB_ITEMS.map((tab) => (
					<Tab key={tab.key} title={tab.title} />
				))}
			</Tabs>

			{/* 탭 콘텐츠 영역 */}
			{children}
		</div>
	);
}

export default observer(AbilitiesLayout);

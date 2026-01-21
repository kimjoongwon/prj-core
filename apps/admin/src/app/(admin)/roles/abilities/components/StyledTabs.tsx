"use client";

import { Tab, Tabs, type TabsProps } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";

/**
 * Tabs 스타일 프리셋
 * 권한 관리 페이지에서 사용하는 Tabs 스타일링
 */
const TABS_CLASS_NAMES = {
	tabList: "bg-content1 rounded-xl p-1",
	cursor: "bg-primary",
	tab: "px-4 py-2",
	tabContent: "group-data-[selected=true]:text-white",
} as const;

export interface StyledTabsProps
	extends Omit<TabsProps, "classNames" | "children"> {
	children: ReactNode;
}

/**
 * StyledTabs Widget 컴포넌트
 *
 * 권한 관리 페이지용 스타일이 적용된 Tabs 컴포넌트입니다.
 * Page 컴포넌트에서 직접 className을 사용하지 않도록 분리합니다.
 */
export const StyledTabs = observer(
	({ children, ...props }: StyledTabsProps) => {
		return (
			<Tabs classNames={TABS_CLASS_NAMES} {...props}>
				{children}
			</Tabs>
		);
	},
);

StyledTabs.displayName = "StyledTabs";

/**
 * Re-export Tab for convenience
 */
export { Tab };

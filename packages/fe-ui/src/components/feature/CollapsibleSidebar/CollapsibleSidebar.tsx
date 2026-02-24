"use client";

import { Button, cn } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VStack } from "../../ui/surfaces/VStack/VStack";
import { renderLucideIcon } from "../../../utils/iconUtils";

export interface ParentMenuInfo {
	name: string;
	pathname: string;
	icon?: string;
}

export interface CollapsibleSidebarProps {
	/** 사이드바 내부 컨텐츠 */
	children: React.ReactNode;
	/** 상위 메뉴 정보 (아이콘, 이름, 경로) */
	parentMenuInfo?: ParentMenuInfo | null;
	/** 접힌 상태 여부 */
	isCollapsed: boolean;
	/** 접힘/펼침 토글 핸들러 */
	onToggle: () => void;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * CollapsibleSidebar Feature 컴포넌트
 *
 * 접힘/펼침이 가능한 사이드바 레이아웃 컴포넌트입니다.
 * 상위 메뉴 정보(아이콘, 이름, 경로)를 헤더에 표시하고,
 * children으로 전달된 네비게이션 아이템을 내부에 렌더링합니다.
 *
 * **컴포넌트 계층:**
 * - UI: Button (토글 버튼)
 * - UI: VStack (레이아웃)
 * - Feature: CollapsibleSidebar (Presentational)
 *
 * @example
 * ```tsx
 * <CollapsibleSidebar
 *   parentMenuInfo={{ name: "설정", pathname: "/settings", icon: "Settings" }}
 *   isCollapsed={isCollapsed}
 *   onToggle={toggleSidebar}
 * >
 *   <NavItem>메뉴 1</NavItem>
 *   <NavItem>메뉴 2</NavItem>
 * </CollapsibleSidebar>
 * ```
 */
export const CollapsibleSidebar = observer(
	({
		children,
		parentMenuInfo,
		isCollapsed,
		onToggle,
		className,
	}: CollapsibleSidebarProps) => {
		return (
			<div
				className={cn(
					"flex h-full flex-col transition-all duration-300",
					isCollapsed ? "w-20" : "w-72",
					className,
				)}
			>
				{/* Header with Parent Menu Info and Toggle */}
				<div
					className={cn(
						"flex items-center bg-content2/50 p-3",
						isCollapsed ? "justify-center" : "justify-between",
					)}
				>
					{!isCollapsed && parentMenuInfo && (
						<div className="flex min-w-0 flex-1 items-center gap-2">
							{parentMenuInfo.icon && (
								<div className="flex-shrink-0">
									{renderLucideIcon(
										parentMenuInfo.icon,
										"w-4 h-4 text-primary",
										16,
									)}
								</div>
							)}
							<div className="min-w-0 flex-1">
								<h3 className="truncate font-semibold text-foreground text-sm">
									{parentMenuInfo.name}
								</h3>
							</div>
						</div>
					)}

					<Button
						isIconOnly
						variant="ghost"
						size="sm"
						onPress={onToggle}
						className="flex-shrink-0 text-default-500 hover:text-default-700"
						aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
					>
						{isCollapsed ? (
							<ChevronRight className="size-4" />
						) : (
							<ChevronLeft className="size-4" />
						)}
					</Button>
				</div>

				{/* Divider */}
				{!isCollapsed && parentMenuInfo && (
					<div className="px-3 py-2">
						<div className="h-px w-full bg-divider" />
					</div>
				)}

				{/* Navigation Items */}
				<div className="flex-1 overflow-y-auto p-3">
					<VStack className="gap-1">{children}</VStack>
				</div>
			</div>
		);
	},
);

CollapsibleSidebar.displayName = "CollapsibleSidebar";

import { Button, Tooltip } from "@heroui/react";
import { useMenuPermission } from "@cocrepo/store";
import { useMemo, useState, type ReactNode } from "react";
import { renderLucideIcon } from "../../../../utils/iconUtils";
import { Text } from "../../data-display/Text/Text";
import type { AdminMenuGroup, AdminMenuItem, AdminSidebarProps } from "./types";

/**
 * 권한 기반 메뉴 아이템 필터링 훅
 */
function useFilteredMenuItem(item: AdminMenuItem): AdminMenuItem | null {
	// permission이 있는 경우 권한 확인
	const permissionKey = item.permission?.replace("menu:", "") ?? "";
	const hasPermission = useMenuPermission(permissionKey);

	// permission이 없으면 항상 표시, 있으면 권한 확인
	const isVisible = !item.permission || hasPermission;

	if (!isVisible) {
		return null;
	}

	return item;
}

/**
 * 메뉴 아이템 컴포넌트
 */
interface MenuItemComponentProps {
	item: AdminMenuItem;
	activePath?: string;
	collapsed?: boolean;
	depth?: number;
	onMenuClick?: (path: string) => void;
}

function MenuItemComponent({
	item,
	activePath,
	collapsed,
	depth = 0,
	onMenuClick,
}: MenuItemComponentProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const filteredItem = useFilteredMenuItem(item);

	// 하위 메뉴 필터링은 부모 컴포넌트에서 처리

	if (!filteredItem) {
		return null;
	}

	const isActive = activePath === item.path;
	const hasChildren = item.children && item.children.length > 0;

	// 하위 메뉴 중 활성화된 것이 있는지 확인
	const hasActiveChild = useMemo(() => {
		if (!item.children || !activePath) return false;
		return item.children.some(
			(child) =>
				child.path === activePath ||
				child.children?.some((grandChild) => grandChild.path === activePath),
		);
	}, [item.children, activePath]);

	// 하위 메뉴에 활성화된 항목이 있으면 자동 펼침
	const isOpen = isExpanded || hasActiveChild;

	const handleClick = () => {
		if (hasChildren) {
			setIsExpanded(!isExpanded);
		} else if (item.path && onMenuClick) {
			onMenuClick(item.path);
		}
	};

	const content = (
		<Button
			variant={isActive ? "flat" : "light"}
			color={isActive ? "primary" : "default"}
			className={`w-full justify-start ${
				collapsed ? "px-2" : depth > 0 ? "pl-8" : "px-3"
			} ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
			onPress={handleClick}
			isDisabled={item.disabled}
		>
			{item.icon && (
				<span className="flex-shrink-0">
					{renderLucideIcon(
						item.icon,
						`w-5 h-5 ${isActive ? "text-primary" : "text-default-500"}`,
						20,
					)}
				</span>
			)}
			{!collapsed && (
				<>
					<span className="flex-1 truncate text-left">
						<Text variant="body2" className={isActive ? "font-medium" : ""}>
							{item.label}
						</Text>
					</span>
					{item.badge !== undefined && (
						<span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1.5 font-medium text-danger-foreground text-xs">
							{item.badge}
						</span>
					)}
					{hasChildren && (
						<span className="ml-1">
							{renderLucideIcon(
								isOpen ? "ChevronDown" : "ChevronRight",
								"w-4 h-4 text-default-400",
								16,
							)}
						</span>
					)}
				</>
			)}
		</Button>
	);

	return (
		<div className="w-full">
			{collapsed ? (
				<Tooltip content={item.label} placement="right">
					{content}
				</Tooltip>
			) : (
				content
			)}

			{/* 하위 메뉴 */}
			{hasChildren && isOpen && !collapsed && (
				<div className="mt-1 space-y-1">
					{item.children?.map((child) => (
						<MenuItemComponent
							key={child.id}
							item={child}
							activePath={activePath}
							collapsed={collapsed}
							depth={depth + 1}
							onMenuClick={onMenuClick}
						/>
					))}
				</div>
			)}
		</div>
	);
}

/**
 * 메뉴 그룹 컴포넌트
 */
interface MenuGroupComponentProps {
	group: AdminMenuGroup;
	activePath?: string;
	collapsed?: boolean;
	onMenuClick?: (path: string) => void;
}

function MenuGroupComponent({
	group,
	activePath,
	collapsed,
	onMenuClick,
}: MenuGroupComponentProps) {
	// 그룹 내 표시할 아이템이 하나라도 있는지 확인
	const hasVisibleItems = group.items.length > 0;

	if (!hasVisibleItems) {
		return null;
	}

	return (
		<div className="mb-4">
			{/* 그룹 라벨 */}
			{!collapsed && (
				<div className="mb-2 px-3">
					<Text
						variant="caption"
						className="font-semibold text-default-400 uppercase tracking-wider"
					>
						{group.label}
					</Text>
				</div>
			)}

			{/* 그룹 아이템 */}
			<div className="space-y-1">
				{group.items.map((item) => (
					<MenuItemComponent
						key={item.id}
						item={item}
						activePath={activePath}
						collapsed={collapsed}
						onMenuClick={onMenuClick}
					/>
				))}
			</div>
		</div>
	);
}

/**
 * AdminSidebar - 권한 기반 메뉴를 표시하는 사이드바
 *
 * 사용 예시:
 * ```tsx
 * <AdminSidebar
 *   menuGroups={menuGroups}
 *   activePath="/admin/users"
 *   onMenuClick={(path) => router.push(path)}
 *   collapsed={isCollapsed}
 *   logo={<Logo />}
 * />
 * ```
 */
export function AdminSidebar({
	menuGroups,
	activePath,
	onMenuClick,
	collapsed = false,
	logo,
}: AdminSidebarProps) {
	return (
		<aside
			className={`flex h-full flex-col border-divider border-r bg-content1 transition-all duration-300 ${
				collapsed ? "w-16" : "w-64"
			}`}
		>
			{/* 로고 영역 */}
			{logo && (
				<div
					className={`flex h-16 items-center border-divider border-b ${
						collapsed ? "justify-center px-2" : "px-4"
					}`}
				>
					{logo}
				</div>
			)}

			{/* 메뉴 영역 */}
			<nav className="flex-1 overflow-y-auto py-4">
				{menuGroups.map((group) => (
					<MenuGroupComponent
						key={group.id}
						group={group}
						activePath={activePath}
						collapsed={collapsed}
						onMenuClick={onMenuClick}
					/>
				))}
			</nav>
		</aside>
	);
}

AdminSidebar.displayName = "AdminSidebar";

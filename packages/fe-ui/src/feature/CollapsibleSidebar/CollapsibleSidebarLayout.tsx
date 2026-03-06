import { Button } from "@heroui/react";
import { icons, type LucideIcon } from "lucide-react";
import { VStack } from "../../layout/VStack/VStack";

function renderLucideIcon(
	iconName?: string,
	className?: string,
	size: number = 16,
) {
	if (!iconName) return null;

	const IconComponent = icons[iconName as keyof typeof icons] as
		| LucideIcon
		| undefined;

	if (!IconComponent) {
		console.warn(`Icon "${iconName}" not found in lucide-react`);
		return null;
	}

	return <IconComponent className={className} size={size} />;
}

interface ParentMenuInfo {
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
}

/**
 * CollapsibleSidebar 컴포넌트
 * 접을 수 있는 사이드바 레이아웃입니다.
 * 상위 메뉴 정보와 함께 네비게이션 아이템을 표시합니다.
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
export const CollapsibleSidebar = (props: CollapsibleSidebarProps) => {
	const { children, parentMenuInfo, isCollapsed, onToggle } = props;

	return (
		<div
			className={`flex h-full flex-col transition-all duration-300 ${
				isCollapsed ? "w-20" : "w-72"
			}`}
		>
			{/* Header with Parent Menu Info and Toggle */}
			<div
				className={`flex items-center bg-content2/50 p-3 ${
					isCollapsed ? "justify-center" : "justify-between"
				}`}
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
					{renderLucideIcon(
						isCollapsed ? "ChevronRight" : "ChevronLeft",
						"w-4 h-4",
						16,
					)}
				</Button>
			</div>

			{/* Divider */}
			{!isCollapsed && parentMenuInfo && (
				<div className="px-3 py-2">
					<div className="h-px w-full"></div>
				</div>
			)}

			{/* Navigation Items */}
			<div className="flex-1 overflow-y-auto p-3">
				<VStack className="gap-1">{children}</VStack>
			</div>
		</div>
	);
};

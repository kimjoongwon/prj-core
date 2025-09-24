import { Button } from "@heroui/react";

import { renderLucideIcon } from "../../../utils/iconUtils";
import { VStack } from "../../ui/VStack/VStack";

interface ParentMenuInfo {
	name: string;
	pathname: string;
	icon?: string;
}

interface CollapsibleSidebarProps {
	children: React.ReactNode;
	parentMenuInfo?: ParentMenuInfo | null;
	isCollapsed: boolean;
	onToggle: () => void;
}

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

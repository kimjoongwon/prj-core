import { Button } from "@heroui/react";
import { observer } from "mobx-react-lite";
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

export const CollapsibleSidebar = observer((props: CollapsibleSidebarProps) => {
	const { children, parentMenuInfo, isCollapsed, onToggle } = props;

	return (
		<div
			className={`flex flex-col h-full transition-all duration-300 ${
				isCollapsed ? "w-20" : "w-72"
			}`}
		>
			{/* Header with Parent Menu Info and Toggle */}
			<div
				className={`flex items-center p-3 bg-content2/50 ${
					isCollapsed ? "justify-center" : "justify-between"
				}`}
			>
				{!isCollapsed && parentMenuInfo && (
					<div className="flex items-center gap-2 flex-1 min-w-0">
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
							<h3 className="text-sm font-semibold text-foreground truncate">
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
					className="text-default-500 hover:text-default-700 flex-shrink-0"
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
					<div className="w-full h-px"></div>
				</div>
			)}

			{/* Navigation Items */}
			<div className="flex-1 overflow-y-auto p-3">
				<VStack className="gap-1">{children}</VStack>
			</div>
		</div>
	);
});

CollapsibleSidebar.displayName = "CollapsibleSidebar";

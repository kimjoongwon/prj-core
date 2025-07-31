import { Button } from "@heroui/react";
import type { MobxProps } from "../../../types";

// Route type definition - moved from @shared/types
interface Route {
	name: string;
	pathname: string;
	iconName?: string;
	submenu?: Route[];
}

import { action } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import { useMobxHookForm } from "../../../hooks";
import { renderLucideIcon } from "../../../utils/iconUtils";
import { VStack } from "../../ui/VStack/VStack";

interface ParentMenuInfo {
	name: string;
	pathname: string;
	icon?: string;
}

interface CollapsibleSidebarProps<T = any> extends MobxProps<T> {
	routes: Route[];
	parentMenuInfo?: ParentMenuInfo | null;
}

export const CollapsibleSidebar = observer(
	<T extends object>(props: CollapsibleSidebarProps<T>) => {
		const { routes, state, path, parentMenuInfo } = props;

		// useMobxHookForm으로 현재 선택된 route path 관리
		const { localState } = useMobxHookForm("", state, path);
		// Local state for collapsed/expanded with localStorage persistence
		const sidebarState = useLocalObservable(() => ({
			isCollapsed: false,
			toggle() {
				this.isCollapsed = !this.isCollapsed;
				// 상태를 localStorage에 저장
				localStorage.setItem(
					"sidebarCollapsed",
					JSON.stringify(this.isCollapsed),
				);
			},
			// localStorage에서 초기 상태 복원
			initialize() {
				if (typeof window !== "undefined") {
					try {
						const saved = localStorage.getItem("sidebarCollapsed");
						if (saved !== null) {
							this.isCollapsed = JSON.parse(saved);
						}
					} catch (error) {
						console.warn(
							"Failed to restore sidebar state from localStorage:",
							error,
						);
					}
				}
			},
		}));

		// 컴포넌트 마운트 시 localStorage에서 상태 복원
		useEffect(() => {
			sidebarState.initialize();
		}, [sidebarState.initialize]);

		const handleRouteClick = action((route: Route) => {
			if (route.fullPath) {
				// console.log(`Setting route path: ${route.fullPath}`);
				// console.log('Current localState value:', localState.value);
				// 선택된 경로를 localState에 저장
				localState.value = route.fullPath;
			}
		});

		return (
			<div
				className={`flex flex-col h-full transition-all duration-300 ${
					sidebarState.isCollapsed ? "w-20" : "w-72"
				}`}
			>
				{/* Header with Parent Menu Info and Toggle */}
				<div
					className={`flex items-center p-3 bg-content2/50 ${
						sidebarState.isCollapsed ? "justify-center" : "justify-between"
					}`}
				>
					{!sidebarState.isCollapsed && parentMenuInfo && (
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
						onPress={sidebarState.toggle}
						className="text-default-500 hover:text-default-700 flex-shrink-0"
						aria-label={
							sidebarState.isCollapsed ? "Expand sidebar" : "Collapse sidebar"
						}
					>
						{renderLucideIcon(
							sidebarState.isCollapsed ? "ChevronRight" : "ChevronLeft",
							"w-4 h-4",
							16,
						)}
					</Button>
				</div>

				{/* Divider */}
				{!sidebarState.isCollapsed && parentMenuInfo && (
					<div className="px-3 py-2">
						<div className="w-full h-px"></div>
					</div>
				)}

				{/* Navigation Items */}
				<div className="flex-1 overflow-y-auto p-3">
					{routes?.length > 0 ? (
						<VStack className="gap-1">
							{routes.map((route, index) => {
								const buttonContent = sidebarState.isCollapsed
									? null
									: route.name || route.fullPath;

								return (
									<Button
										variant="light"
										color={route.active ? "primary" : "default"}
										key={route.name || `route-${index}`}
										onPress={() => handleRouteClick(route)}
										className={`transition-all duration-200 ${
											sidebarState.isCollapsed
												? "justify-center items-center flex px-0 min-w-12 w-12 h-12 mx-auto"
												: "justify-start px-3 w-full"
										} ${route.active ? "bg-primary/10" : ""}`}
										isIconOnly={sidebarState.isCollapsed}
										startContent={
											sidebarState.isCollapsed
												? undefined
												: route.icon
													? renderLucideIcon(route.icon, "w-4 h-4", 16)
													: undefined
										}
										title={
											sidebarState.isCollapsed
												? route.name || route.fullPath
												: undefined
										}
									>
										{sidebarState.isCollapsed
											? route.icon
												? renderLucideIcon(route.icon, "w-5 h-5", 20)
												: renderLucideIcon("Circle", "w-4 h-4", 16)
											: buttonContent}
									</Button>
								);
							})}
						</VStack>
					) : (
						!sidebarState.isCollapsed && (
							<div className="flex flex-col items-center justify-center py-8 text-center">
								<div className="w-12 h-12 mb-3 rounded-lg bg-default-100 flex items-center justify-center">
									{renderLucideIcon(
										"FolderOpen",
										"w-6 h-6 text-default-400",
										24,
									)}
								</div>
								<p className="text-sm text-default-500 mb-1">메뉴 없음</p>
								<p className="text-xs text-default-400">
									선택된 항목에 하위 메뉴가 없습니다
								</p>
							</div>
						)
					)}
				</div>
			</div>
		);
	},
);

CollapsibleSidebar.displayName = "CollapsibleSidebar";

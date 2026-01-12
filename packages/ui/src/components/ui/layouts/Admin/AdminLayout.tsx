import { Button } from "@heroui/react";
import { useState } from "react";
import { renderLucideIcon } from "../../../../utils/iconUtils";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import type { AdminLayoutProps } from "./types";

/**
 * AdminLayout - 관리자 페이지 레이아웃
 *
 * 권한 기반 메뉴 필터링, 반응형 사이드바, 헤더를 포함하는
 * 완전한 관리자 레이아웃 컴포넌트입니다.
 *
 * 사용 예시:
 * ```tsx
 * const menuGroups = [
 *   {
 *     id: "main",
 *     label: "메인",
 *     items: [
 *       { id: "dashboard", label: "대시보드", icon: "LayoutDashboard", path: "/admin", permission: "menu:dashboard" },
 *       { id: "users", label: "사용자 관리", icon: "Users", path: "/admin/users", permission: "menu:users" },
 *     ],
 *   },
 * ];
 *
 * <AdminLayout
 *   menuGroups={menuGroups}
 *   activePath={pathname}
 *   onMenuClick={(path) => router.push(path)}
 *   userInfo={{ name: "관리자", email: "admin@example.com" }}
 *   onLogout={() => logout()}
 *   logo={<Logo />}
 * >
 *   <YourPageContent />
 * </AdminLayout>
 * ```
 */
export function AdminLayout({
	menuGroups,
	activePath,
	onMenuClick,
	userInfo,
	logo,
	headerActions,
	onLogout,
	children,
	collapsed: controlledCollapsed,
	onCollapsedChange,
}: AdminLayoutProps) {
	// 제어/비제어 컴포넌트 패턴
	const [internalCollapsed, setInternalCollapsed] = useState(false);
	const isCollapsed = controlledCollapsed ?? internalCollapsed;
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleCollapsedChange = (newCollapsed: boolean) => {
		if (onCollapsedChange) {
			onCollapsedChange(newCollapsed);
		} else {
			setInternalCollapsed(newCollapsed);
		}
	};

	const handleToggleSidebar = () => {
		// 데스크톱에서는 접힘 토글
		handleCollapsedChange(!isCollapsed);
	};

	const handleMobileToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const handleMenuClick = (path: string) => {
		onMenuClick?.(path);
		// 모바일에서 메뉴 클릭 시 사이드바 닫기
		setMobileOpen(false);
	};

	return (
		<div className="flex h-screen bg-background">
			{/* 데스크톱 사이드바 */}
			<div className="hidden lg:block">
				<AdminSidebar
					menuGroups={menuGroups}
					activePath={activePath}
					onMenuClick={handleMenuClick}
					collapsed={isCollapsed}
					logo={logo}
				/>
			</div>

			{/* 모바일 사이드바 오버레이 */}
			{mobileOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/50 lg:hidden"
					onClick={handleMobileToggle}
					onKeyDown={(e) => e.key === "Escape" && handleMobileToggle()}
					role="button"
					tabIndex={0}
					aria-label="Close sidebar"
				/>
			)}

			{/* 모바일 사이드바 */}
			<div
				className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-content1 shadow-xl transition-transform duration-300 lg:hidden ${
					mobileOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<AdminSidebar
					menuGroups={menuGroups}
					activePath={activePath}
					onMenuClick={handleMenuClick}
					collapsed={false}
					logo={logo}
				/>
			</div>

			{/* 메인 컨텐츠 영역 */}
			<div className="flex flex-1 flex-col overflow-hidden">
				{/* 헤더 */}
				<AdminHeader
					userInfo={userInfo}
					actions={
						<div className="flex items-center gap-2">
							{headerActions}
							{/* 데스크톱 사이드바 토글 버튼 */}
							<Button
								isIconOnly
								variant="light"
								size="sm"
								onPress={handleToggleSidebar}
								className="hidden lg:flex"
								aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
							>
								{renderLucideIcon(
									isCollapsed ? "PanelLeftOpen" : "PanelLeftClose",
									"w-5 h-5",
									20,
								)}
							</Button>
						</div>
					}
					onLogout={onLogout}
					onToggleSidebar={handleMobileToggle}
				/>

				{/* 메인 컨텐츠 */}
				<main className="flex-1 overflow-y-auto bg-content2 p-4 sm:p-6">
					{children}
				</main>
			</div>
		</div>
	);
}

AdminLayout.displayName = "AdminLayout";

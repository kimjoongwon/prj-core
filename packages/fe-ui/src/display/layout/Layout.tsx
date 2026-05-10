"use client";

import { cn } from "@cocrepo/ui/heroui";
import { observer } from "mobx-react-lite";
import type { LayoutProps } from "./type";

/**
 * Layout
 * - App > Layout > Page > Section 위계에서 Layout 영역을 담당합니다.
 * - Header/Sidebar/Mobile UI는 슬롯으로 주입받아 배치만 수행합니다.
 */
export const Layout = observer(function Layout({
	header,
	sidebar,
	mobileBottomNav,
	mobileFab,
	mobileOverlayMenu,
	desktopVariant = "inline-sidebar",
	className,
	bodyClassName,
	sidebarClassName,
	mainClassName,
	children,
}: LayoutProps) {
	if (desktopVariant === "stacked-header") {
		return (
				<div
					className={cn(
						"relative flex h-screen flex-col overflow-hidden bg-background text-foreground",
						className,
					)}
				>
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_30%),radial-gradient(circle_at_bottom_right,color-mix(in_oklab,var(--color-success)_12%,transparent),transparent_28%)]" />
				<div className="relative flex min-h-0 flex-1 flex-col">
					{header}
					<div className={cn("flex min-h-0 flex-1", bodyClassName)}>
						{sidebar && (
							<div
								className={cn(
									"hidden md:block md:w-[304px] md:flex-none",
									sidebarClassName,
								)}
							>
								{sidebar}
							</div>
						)}
						<main
							className={cn(
								"min-w-0 flex-1 overflow-y-auto px-4 pb-20 pt-4 md:px-6 md:pb-6 md:pt-5",
								mainClassName,
							)}
						>
							{children}
						</main>
					</div>
				</div>
				{mobileOverlayMenu}
				{mobileFab}
				{mobileBottomNav}
			</div>
		);
	}

	return (
		<div className={cn("flex h-screen bg-background", className)}>
			{sidebar && (
				<div className={cn("hidden md:block", sidebarClassName)}>{sidebar}</div>
			)}
			<div className="flex flex-1 flex-col overflow-hidden">
				{header}
				<main
					className={cn(
						"flex-1 overflow-y-auto bg-content2 p-4 pb-20 md:p-6 md:pb-6",
						mainClassName,
					)}
				>
					{children}
				</main>
			</div>
			{mobileOverlayMenu}
			{mobileFab}
			{mobileBottomNav}
		</div>
	);
});

Layout.displayName = "Layout";

"use client";

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
	className,
	mainClassName,
	children,
}: LayoutProps) {
	return (
		<div
			className={`flex h-screen bg-background${className ? ` ${className}` : ""}`}
		>
			{sidebar && <div className="hidden md:block">{sidebar}</div>}
			<div className="flex flex-1 flex-col overflow-hidden">
				{header}
				<main
					className={`flex-1 overflow-y-auto bg-content2 p-4 pb-20 md:p-6 md:pb-6${
						mainClassName ? ` ${mainClassName}` : ""
					}`}
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

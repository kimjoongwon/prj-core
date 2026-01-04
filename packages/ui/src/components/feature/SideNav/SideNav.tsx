"use client";

import type { Menu } from "@cocrepo/store";
import { useMenuStore } from "@cocrepo/store";
import {
	Accordion,
	AccordionItem,
	type AccordionItemIndicatorProps,
	cn,
} from "@heroui/react";
import type { Selection } from "@react-types/shared";
import { ChevronRight } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useMemo, useSyncExternalStore } from "react";
import { renderLucideIcon } from "../../../utils/iconUtils";
import { Text } from "../../ui/data-display/Text/Text";
import { VStack } from "../../ui/surfaces/VStack/VStack";

/**
 * 클라이언트 마운트 상태를 추적하는 훅
 * SSR과 클라이언트 초기 렌더링을 일관되게 유지
 */
function useIsMounted(): boolean {
	return useSyncExternalStore(
		() => () => {},
		() => true,
		() => false,
	);
}

export interface SideNavProps {
	/** 사이드바 너비 (기본값: 240px) */
	width?: number;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * SideNav Feature 컴포넌트
 * 좌측 사이드바에 2depth 트리 메뉴를 표시합니다.
 * HeroUI Accordion을 사용하여 애니메이션과 함께 메뉴를 펼침/접힘합니다.
 * MenuStore를 사용하여 메뉴 상태를 관리합니다.
 *
 * @example
 * ```tsx
 * <PageLayout leftAside={<SideNav />}>
 *   {children}
 * </PageLayout>
 * ```
 */
export const SideNav = observer(({ width = 240, className }: SideNavProps) => {
	const menuStore = useMenuStore();
	const isMounted = useIsMounted();

	// SSR 대응: 클라이언트 마운트 전에는 빈 배열
	const menuItems = isMounted ? menuStore.items : [];

	// 하위 메뉴가 있는 메뉴 아이템만 필터링
	const parentMenus = useMemo(
		() => menuItems.filter((menu) => menu.hasChildren),
		[menuItems],
	);

	// 하위 메뉴가 없는 메뉴 아이템 (대시보드 등)
	const standaloneMenus = useMemo(
		() => menuItems.filter((menu) => !menu.hasChildren),
		[menuItems],
	);

	// 현재 펼쳐진 메뉴 ID들을 Selection으로 변환
	// Note: useMemo 대신 직접 계산 - MobX observable 변경 추적을 위해
	const expandedKeys = (() => {
		const keys = new Set<string>();
		for (const menu of parentMenus) {
			if (menuStore.isMenuExpanded(menu.id)) {
				keys.add(menu.id);
			}
		}
		return keys;
	})();

	/**
	 * Accordion 선택 변경 핸들러
	 */
	const handleSelectionChange = (keys: Selection) => {
		if (keys === "all") return;

		const keysSet = keys as Set<string>;

		// 펼쳐진 메뉴와 접힌 메뉴 동기화
		for (const menu of parentMenus) {
			const isExpanded = menuStore.isMenuExpanded(menu.id);
			const shouldBeExpanded = keysSet.has(menu.id);

			if (isExpanded !== shouldBeExpanded) {
				menuStore.toggleMenu(menu.id);
			}
		}
	};

	/**
	 * 단독 메뉴 클릭 핸들러 (하위 메뉴가 없는 경우)
	 */
	const handleClickStandaloneMenu = (menu: Menu) => {
		menuStore.selectMenu(menu.id);
	};

	/**
	 * 2depth 메뉴 클릭 핸들러
	 */
	const handleClickSubMenu = (subMenuId: string) => {
		menuStore.selectSubMenu(subMenuId);
	};

	/**
	 * 커스텀 인디케이터 렌더링 (펼침/접힘 아이콘)
	 */
	const renderIndicator = ({ isOpen }: AccordionItemIndicatorProps) => (
		<ChevronRight
			className={cn(
				"h-4 w-4 text-foreground/40 transition-transform duration-200",
				isOpen && "rotate-90",
			)}
		/>
	);

	return (
		<nav
			className={cn(
				"flex h-full flex-col border-r border-divider bg-content1",
				className,
			)}
			style={{ width: `${width}px` }}
		>
			<VStack className="flex-1 overflow-y-auto p-3" gap={1}>
				{/* 단독 메뉴 (하위 메뉴가 없는 경우) */}
				{standaloneMenus.map((menu) => (
					<button
						key={menu.id}
						type="button"
						onClick={() => handleClickStandaloneMenu(menu)}
						className={cn(
							"flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
							menu.active
								? "bg-primary/10 text-primary"
								: "text-foreground/70 hover:bg-default-100 hover:text-foreground",
						)}
					>
						{menu.icon && renderLucideIcon(menu.icon, "h-5 w-5", 20)}
						<Text>{menu.label}</Text>
					</button>
				))}

				{/* 하위 메뉴가 있는 Accordion 메뉴 */}
				{parentMenus.length > 0 && (
					<Accordion
						selectionMode="multiple"
						selectedKeys={expandedKeys}
						onSelectionChange={handleSelectionChange}
						className="px-0"
						itemClasses={{
							base: "py-0",
							title: "text-sm font-medium",
							trigger: cn(
								"rounded-lg px-3 py-2.5 data-[hover=true]:bg-default-100",
								"flex-row-reverse justify-between",
							),
							indicator: "text-foreground/40",
							content: "pt-1 pb-0",
						}}
						motionProps={{
							variants: {
								enter: {
									y: 0,
									opacity: 1,
									height: "auto",
									transition: {
										height: { type: "spring", stiffness: 500, damping: 30 },
										opacity: { duration: 0.2 },
									},
								},
								exit: {
									y: -10,
									opacity: 0,
									height: 0,
									transition: {
										height: { duration: 0.2 },
										opacity: { duration: 0.15 },
									},
								},
							},
						}}
					>
						{parentMenus.map((menu) => (
							<AccordionItem
								key={menu.id}
								aria-label={menu.label}
								title={
									<span
										className={cn(
											"transition-colors",
											menu.active ? "text-primary" : "text-foreground/70",
										)}
									>
										{menu.label}
									</span>
								}
								startContent={
									menu.icon && (
										<span
											className={cn(
												"transition-colors",
												menu.active ? "text-primary" : "text-foreground/70",
											)}
										>
											{renderLucideIcon(menu.icon, "h-5 w-5", 20)}
										</span>
									)
								}
								indicator={renderIndicator}
								classNames={{
									title: menu.active ? "text-primary" : "text-foreground/70",
								}}
							>
								<VStack gap={0}>
									{menu.children.map((subMenu) => (
										<button
											key={subMenu.id}
											type="button"
											onClick={() => handleClickSubMenu(subMenu.id)}
											className={cn(
												"flex w-full items-center rounded-md py-2 pl-11 pr-3 text-sm transition-colors",
												subMenu.active
													? "bg-primary/10 font-medium text-primary"
													: "text-foreground/60 hover:bg-default-100 hover:text-foreground",
											)}
										>
											<Text>{subMenu.label}</Text>
										</button>
									))}
								</VStack>
							</AccordionItem>
						))}
					</Accordion>
				)}
			</VStack>
		</nav>
	);
});

SideNav.displayName = "SideNav";

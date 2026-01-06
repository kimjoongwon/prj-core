"use client";

import type { NavItem } from "@cocrepo/store";
import {
	Accordion,
	AccordionItem,
	type AccordionItemIndicatorProps,
	cn,
} from "@heroui/react";
import type { Selection } from "@react-types/shared";
import { ChevronRight } from "lucide-react";
import { observer } from "mobx-react-lite";
import { renderLucideIcon } from "../../../utils/iconUtils";
import { Text } from "../../ui/data-display/Text/Text";
import { VStack } from "../../ui/surfaces/VStack/VStack";

/**
 * Widget용 네비게이션 아이템 타입
 * Store의 NavItem 타입을 기반으로 정의
 */
type NavTreeItem = NavItem & {};

export interface NavTreePanelProps {
	/** 네비게이션 아이템 목록 */
	items: NavTreeItem[];
	/** 펼쳐진 아이템 ID Set */
	expandedKeys: Set<string>;
	/** 아이템 펼침/접힘 토글 핸들러 */
	onToggle: (id: string) => void;
	/** 단독 아이템 (하위 없음) 선택 핸들러 */
	onSelectItem: (id: string) => void;
	/** 하위 아이템 선택 핸들러 */
	onSelectSubItem: (id: string) => void;
	/** 사이드바 너비 (기본값: 240px) */
	width?: number;
	/** 추가 CSS 클래스 */
	className?: string;
}

/**
 * NavTreePanel Widget 컴포넌트
 *
 * 2depth 트리 구조의 네비게이션 UI를 표시하는 순수 UI 컴포넌트입니다.
 * HeroUI Accordion을 사용하여 애니메이션과 함께 아이템을 펼침/접힘합니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <NavTreePanel
 *   items={navItems}
 *   expandedKeys={expandedKeys}
 *   onToggle={handleToggle}
 *   onSelectItem={handleSelectItem}
 *   onSelectSubItem={handleSelectSubItem}
 * />
 * ```
 */
export const NavTreePanel = observer(
	({
		items,
		expandedKeys,
		onToggle,
		onSelectItem,
		onSelectSubItem,
		width = 240,
		className,
	}: NavTreePanelProps) => {
		// 하위 아이템이 있는 아이템만 필터링
		const parentItems = items.filter((item) => item.hasChildren);

		// 하위 아이템이 없는 아이템 (대시보드 등)
		const standaloneItems = items.filter((item) => !item.hasChildren);

	/**
	 * Accordion 선택 변경 핸들러
	 */
	const handleSelectionChange = (keys: Selection) => {
		if (keys === "all") return;

		const keysSet = keys as Set<string>;

		// 펼쳐진 아이템과 접힌 아이템 동기화
		for (const item of parentItems) {
			const isExpanded = expandedKeys.has(item.id);
			const shouldBeExpanded = keysSet.has(item.id);

			if (isExpanded !== shouldBeExpanded) {
				onToggle(item.id);
			}
		}
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
				{/* 단독 아이템 (하위 아이템이 없는 경우) */}
				{standaloneItems.map((item) => (
					<button
						key={item.id}
						type="button"
						onClick={() => onSelectItem(item.id)}
						className={cn(
							"flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
							item.active
								? "bg-primary/10 text-primary"
								: "text-foreground/70 hover:bg-default-100 hover:text-foreground",
						)}
					>
						{item.icon && renderLucideIcon(item.icon, "h-5 w-5", 20)}
						<Text>{item.label}</Text>
					</button>
				))}

				{/* 하위 아이템이 있는 Accordion */}
				{parentItems.length > 0 && (
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
						{parentItems.map((item) => (
							<AccordionItem
								key={item.id}
								aria-label={item.label}
								title={
									<span
										className={cn(
											"transition-colors",
											item.active ? "text-primary" : "text-foreground/70",
										)}
									>
										{item.label}
									</span>
								}
								startContent={
									item.icon && (
										<span
											className={cn(
												"transition-colors",
												item.active ? "text-primary" : "text-foreground/70",
											)}
										>
											{renderLucideIcon(item.icon, "h-5 w-5", 20)}
										</span>
									)
								}
								indicator={renderIndicator}
								classNames={{
									title: item.active ? "text-primary" : "text-foreground/70",
								}}
							>
								<VStack gap={0}>
									{item.children.map((subItem) => (
										<button
											key={subItem.id}
											type="button"
											onClick={() => onSelectSubItem(subItem.id)}
											className={cn(
												"flex w-full items-center rounded-md py-2 pl-11 pr-3 text-sm transition-colors",
												subItem.active
													? "bg-primary/10 font-medium text-primary"
													: "text-foreground/60 hover:bg-default-100 hover:text-foreground",
											)}
										>
											<Text>{subItem.label}</Text>
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
	},
);

NavTreePanel.displayName = "NavTreePanel";

"use client";

import {
	Avatar,
	Button,
	cn,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
} from "@heroui/react";
import { ChevronDown, LogOut } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { HeaderBarProps } from "../../display/layout/type";

/**
 * HeaderBar - 관리자 레이아웃 헤더 (v7.0)
 *
 * 기획서 참조: 01-desktop.md, 02-mobile.md
 * - 데스크톱/모바일 공용 헤더
 * - 모바일에서는 로고 표시
 * - 오른쪽: 알림, Space 선택, 사용자 메뉴
 *
 * @example
 * ```tsx
 * <HeaderBar
 *   userInfo={{ name: "홍길동", email: "hong@example.com", role: "관리자" }}
 *   onLogout={() => logout()}
 *   logo={<Logo />}
 *   actions={<NotificationButton />}
 * />
 * ```
 */
export const HeaderBar = observer(function HeaderBar({
	userInfo,
	actions,
	onLogout,
	logo,
	leading,
	context,
	className,
	renderUserMenu,
}: HeaderBarProps) {
	const handleLogout = () => {
		onLogout?.();
	};

	const leadingContent = leading ?? logo;
	const userMenu =
		userInfo &&
		(renderUserMenu ? (
			renderUserMenu({ userInfo, onLogout })
		) : (
			<Dropdown placement="bottom-end">
				<DropdownTrigger>
					<Button
						variant="light"
						className="h-11 rounded-2xl border border-slate-200/70 bg-white/72 px-2 pr-3 shadow-sm backdrop-blur-md hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
						aria-label="사용자 메뉴"
					>
						<Avatar
							size="sm"
							src={userInfo.avatarUrl}
							name={userInfo.name}
							showFallback
							className="h-8 w-8 bg-slate-950 text-white dark:bg-white dark:text-slate-950"
						/>
						<div className="hidden flex-col items-start sm:flex">
							<span className="text-sm font-semibold text-slate-950 dark:text-slate-50">
								{userInfo.name}
							</span>
							{userInfo.role && (
								<span className="text-xs text-slate-500 dark:text-slate-400">
									{userInfo.role}
								</span>
							)}
						</div>
						<ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
					</Button>
				</DropdownTrigger>
				<DropdownMenu aria-label="사용자 메뉴" variant="flat">
					<DropdownSection showDivider>
						<DropdownItem
							key="identity"
							description={userInfo.role}
							textValue={`${userInfo.name} ${userInfo.role ?? ""}`}
						>
							{userInfo.name}
						</DropdownItem>
					</DropdownSection>
					<DropdownSection>
						<DropdownItem
							key="logout"
							color="danger"
							startContent={
								<LogOut className="h-4 w-4 text-danger" size={16} />
							}
							onPress={handleLogout}
						>
							로그아웃
						</DropdownItem>
					</DropdownSection>
				</DropdownMenu>
			</Dropdown>
		));

	return (
		<header
			className={cn(
				"relative z-30 border-b border-slate-200/70 bg-white/82 backdrop-blur-2xl dark:border-white/10 dark:bg-[#06080d]/82",
				className,
			)}
		>
			<div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
			<div className="flex h-16 items-center justify-between gap-4 px-4 md:h-[72px] md:px-6">
				<div className="flex min-w-0 items-center gap-3 md:gap-4">
					{leadingContent}
					{context && (
						<>
							{leadingContent && (
								<div className="hidden h-8 w-px bg-slate-200/80 dark:bg-white/10 md:block" />
							)}
							<div className="hidden min-w-0 items-center gap-3 md:flex">
								{context}
							</div>
						</>
					)}
				</div>

				<div className="flex items-center gap-2">
					{actions}
					{userMenu}
				</div>
			</div>
		</header>
	);
});

HeaderBar.displayName = "HeaderBar";

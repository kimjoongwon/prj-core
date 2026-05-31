"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { observer } from "mobx-react-lite";
import {
	Avatar,
	Button,
	cn,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
} from "../../design-system/primitives";
import type { HeaderBarProps } from "../../display/layout/type";
import { useT } from "../../i18n";

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
	const t = useT();
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
						className="h-11 rounded-2xl border border-divider bg-content1/80 px-2 pr-3 text-foreground shadow-sm backdrop-blur-md hover:bg-content2"
						aria-label={t("사용자 메뉴")}
					>
						<Avatar
							size="sm"
							src={userInfo.avatarUrl}
							name={userInfo.name}
							showFallback
							className="h-8 w-8 bg-foreground text-background"
						/>
						<div className="hidden flex-col items-start sm:flex">
							<span className="text-sm font-semibold text-foreground">
								{userInfo.name}
							</span>
							{userInfo.role && (
								<span className="text-xs text-default-500">
									{userInfo.role}
								</span>
							)}
						</div>
						<ChevronDown className="hidden h-4 w-4 text-default-400 sm:block" />
					</Button>
				</DropdownTrigger>
				<DropdownMenu aria-label={t("사용자 메뉴")} variant="flat">
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
							{t("로그아웃")}
						</DropdownItem>
					</DropdownSection>
				</DropdownMenu>
			</Dropdown>
		));

	return (
		<header
			className={cn(
				"relative z-30 border-b border-divider bg-background/82 backdrop-blur-2xl",
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
								<div className="hidden h-8 w-px bg-divider md:block" />
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

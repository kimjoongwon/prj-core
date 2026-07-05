"use client";

import { Avatar, cn, Dropdown } from "@heroui/react";
import { ChevronDown, LogOut } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";
import type { HeaderBarProps } from "./HeaderBar.type";

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
			<Dropdown>
				<Dropdown.Trigger
					aria-label={t("사용자 메뉴")}
					className="inline-flex h-11 items-center gap-2 rounded-2xl border border-border bg-surface/80 px-2 pr-3 text-foreground shadow-sm backdrop-blur-md hover:bg-surface-secondary"
				>
					<Avatar size="sm" className="h-8 w-8 bg-foreground text-background">
						{userInfo.avatarUrl ? (
							<Avatar.Image src={userInfo.avatarUrl} alt={userInfo.name} />
						) : null}
						<Avatar.Fallback>{userInfo.name.slice(0, 1)}</Avatar.Fallback>
					</Avatar>
					<div className="hidden flex-col items-start sm:flex">
						<span className="text-sm font-semibold text-foreground">
							{userInfo.name}
						</span>
						{userInfo.role && (
							<span className="text-xs text-muted">{userInfo.role}</span>
						)}
					</div>
					<ChevronDown className="hidden h-4 w-4 text-muted sm:block" />
				</Dropdown.Trigger>
				<Dropdown.Popover placement="bottom end">
					<Dropdown.Menu
						aria-label={t("사용자 메뉴")}
						onAction={(key) => {
							if (key === "logout") handleLogout();
						}}
					>
						<Dropdown.Section className="border-b border-border pb-2">
							<Dropdown.Item
								id="identity"
								textValue={`${userInfo.name} ${userInfo.role ?? ""}`}
							>
								<div className="flex flex-col">
									<span>{userInfo.name}</span>
									{userInfo.role ? (
										<span className="text-xs text-muted">{userInfo.role}</span>
									) : null}
								</div>
							</Dropdown.Item>
						</Dropdown.Section>
						<Dropdown.Section>
							<Dropdown.Item id="logout" className="text-danger">
								<span className="flex items-center gap-2">
									<LogOut className="h-4 w-4 text-danger" size={16} />
									{t("로그아웃")}
								</span>
							</Dropdown.Item>
						</Dropdown.Section>
					</Dropdown.Menu>
				</Dropdown.Popover>
			</Dropdown>
		));

	return (
		<header
			className={cn(
				"relative z-30 border-b border-border bg-background/82 backdrop-blur-2xl",
				className,
			)}
		>
			<div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
			<div className="flex h-16 items-center justify-between gap-4 px-4 md:h-[72px] md:px-6">
				<div className="flex min-w-0 items-center gap-3 md:gap-4">
					{leadingContent}
					{context && (
						<>
							{leadingContent && (
								<div className="hidden h-8 w-px bg-border md:block" />
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

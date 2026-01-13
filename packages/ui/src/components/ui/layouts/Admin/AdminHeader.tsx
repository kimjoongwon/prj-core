"use client";

import {
	Avatar,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { renderLucideIcon } from "../../../../utils/iconUtils";
import type { AdminHeaderProps } from "./types";

/**
 * AdminHeader - 관리자 레이아웃 헤더 (v7.0)
 *
 * 기획서 참조: 01-desktop.md, 02-mobile.md
 * - 데스크톱/모바일 공용 헤더
 * - 모바일에서는 로고 표시
 * - 오른쪽: 알림, Space 선택, 사용자 메뉴
 *
 * @example
 * ```tsx
 * <AdminHeader
 *   userInfo={{ name: "홍길동", email: "hong@example.com", role: "관리자" }}
 *   onLogout={() => logout()}
 *   logo={<Logo />}
 *   actions={<NotificationButton />}
 * />
 * ```
 */
export const AdminHeader = observer(function AdminHeader({
	userInfo,
	actions,
	onLogout,
	logo,
}: AdminHeaderProps) {
	const handleLogout = () => {
		onLogout?.();
	};

	return (
		<header className="flex h-14 items-center justify-between border-divider border-b bg-content1 px-4">
			{/* 왼쪽: 로고 (모바일에서만 표시) */}
			<div className="flex items-center">
				{logo && <div className="md:hidden">{logo}</div>}
			</div>

			{/* 오른쪽: 액션 버튼들 + 사용자 메뉴 */}
			<div className="flex items-center gap-2">
				{/* 커스텀 액션 영역 (알림, Space 선택 등) */}
				{actions}

				{/* 사용자 드롭다운 */}
				{userInfo && (
					<Dropdown placement="bottom-end">
						<DropdownTrigger>
							<Button
								variant="light"
								className="gap-2 px-2"
								aria-label="User menu"
							>
								<Avatar
									size="sm"
									src={userInfo.avatarUrl}
									name={userInfo.name}
									showFallback
									className="h-8 w-8"
								/>
								<div className="hidden flex-col items-start sm:flex">
									<span className="font-medium text-foreground text-sm">
										{userInfo.name}
									</span>
									{userInfo.role && (
										<span className="text-default-500 text-xs">
											{userInfo.role}
										</span>
									)}
								</div>
								{renderLucideIcon(
									"ChevronDown",
									"w-4 h-4 text-default-400 hidden sm:block",
									16,
								)}
							</Button>
						</DropdownTrigger>
						<DropdownMenu aria-label="User actions">
							<DropdownSection showDivider>
								<DropdownItem
									key="profile"
									description={userInfo.email}
									startContent={renderLucideIcon(
										"User",
										"w-4 h-4 text-default-500",
										16,
									)}
								>
									내 프로필
								</DropdownItem>
								<DropdownItem
									key="settings"
									startContent={renderLucideIcon(
										"Settings",
										"w-4 h-4 text-default-500",
										16,
									)}
								>
									설정
								</DropdownItem>
							</DropdownSection>
							<DropdownSection>
								<DropdownItem
									key="logout"
									color="danger"
									startContent={renderLucideIcon(
										"LogOut",
										"w-4 h-4 text-danger",
										16,
									)}
									onPress={handleLogout}
								>
									로그아웃
								</DropdownItem>
							</DropdownSection>
						</DropdownMenu>
					</Dropdown>
				)}
			</div>
		</header>
	);
});

AdminHeader.displayName = "AdminHeader";

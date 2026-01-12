import {
	Avatar,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
} from "@heroui/react";
import { renderLucideIcon } from "../../../../utils/iconUtils";
import { Text } from "../../data-display/Text/Text";
import type { AdminHeaderProps } from "./types";

/**
 * AdminHeader - 관리자 레이아웃 헤더
 *
 * 사용 예시:
 * ```tsx
 * <AdminHeader
 *   userInfo={{ name: "홍길동", email: "hong@example.com", role: "관리자" }}
 *   onLogout={() => logout()}
 *   onToggleSidebar={() => setCollapsed(!collapsed)}
 *   actions={<NotificationButton />}
 * />
 * ```
 */
export function AdminHeader({
	userInfo,
	actions,
	onLogout,
	onToggleSidebar,
}: AdminHeaderProps) {
	return (
		<header className="flex h-16 items-center justify-between border-divider border-b bg-content1 px-4">
			{/* 왼쪽: 사이드바 토글 (모바일) */}
			<div className="flex items-center gap-2">
				{onToggleSidebar && (
					<Button
						isIconOnly
						variant="light"
						size="sm"
						onPress={onToggleSidebar}
						className="lg:hidden"
						aria-label="Toggle sidebar"
					>
						{renderLucideIcon("Menu", "w-5 h-5", 20)}
					</Button>
				)}
			</div>

			{/* 오른쪽: 액션 버튼들 + 사용자 메뉴 */}
			<div className="flex items-center gap-2">
				{/* 커스텀 액션 영역 */}
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
								<div className="hidden flex-col items-start md:flex">
									<Text variant="body2" className="font-medium">
										{userInfo.name}
									</Text>
									{userInfo.role && (
										<Text variant="caption" className="text-default-500">
											{userInfo.role}
										</Text>
									)}
								</div>
								{renderLucideIcon(
									"ChevronDown",
									"w-4 h-4 text-default-400",
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
									onPress={onLogout}
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
}

AdminHeader.displayName = "AdminHeader";

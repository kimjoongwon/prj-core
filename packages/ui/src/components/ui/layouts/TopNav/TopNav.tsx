import {
	Avatar,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Navbar,
	NavbarBrand,
	NavbarContent,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { renderLucideIcon } from "../../../../utils";
import { Text } from "../../data-display/Text/Text";

/**
 * 메뉴 아이템 인터페이스 (MenuItemStore와 호환)
 */
export interface TopNavMenuItem {
	id: string;
	label: string;
	icon?: string;
	active: boolean;
}

/**
 * 사용자 정보 인터페이스
 */
export interface TopNavUser {
	id: string;
	name: string;
	role: string;
	avatarUrl?: string;
}

/**
 * 컨텍스트 정보 인터페이스 (예: Ground, Tenant 등)
 */
export interface TopNavContext {
	id: string;
	name: string;
}

export interface TopNavProps {
	/** 주요 메뉴 아이템 */
	menuItems: TopNavMenuItem[];
	/** 현재 사용자 */
	currentUser: TopNavUser | null;
	/** 현재 컨텍스트 (선택적) */
	currentContext?: TopNavContext | null;
	/** 메뉴 클릭 핸들러 */
	onClickMenu: (menuId: string) => void;
	/** 컨텍스트 변경 핸들러 */
	onChangeContext?: () => void;
	/** 로그아웃 핸들러 */
	onLogout: () => void;
	/** 로고 클릭 핸들러 */
	onClickLogo?: () => void;
	/** 로고 아이콘 이름 */
	logoIcon?: string;
	/** 로고 텍스트 */
	logoText?: string;
	/** 컨텍스트 변경 텍스트 */
	changeContextText?: string;
	/** 추가 네비게이션 컨텐츠 */
	extraContent?: ReactNode;
}

/**
 * TopNav 컴포넌트
 * 범용적인 상단 네비게이션 바
 *
 * 구성:
 * - 좌측: 로고 + 주요 메뉴
 * - 우측: 컨텍스트 선택 드롭다운 + 사용자 메뉴
 */
export const TopNav = observer<TopNavProps>(
	({
		menuItems,
		currentUser,
		currentContext,
		onClickMenu,
		onChangeContext,
		onLogout,
		onClickLogo,
		logoIcon = "LayoutGrid",
		logoText = "App",
		changeContextText = "변경하기",
		extraContent,
	}) => {
		return (
			<Navbar
				maxWidth="full"
				classNames={{
					base: "border-b border-divider bg-background h-16",
					wrapper: "px-6",
				}}
			>
				{/* 좌측: 로고 + 메뉴 */}
				<NavbarContent className="gap-6" justify="start">
					<NavbarBrand className="cursor-pointer" onClick={onClickLogo}>
						{renderLucideIcon(logoIcon, "w-6 h-6 text-primary", 24)}
						<Text variant="h5" className="ml-2 font-bold">
							{logoText}
						</Text>
					</NavbarBrand>

					{/* 주요 메뉴 */}
					<div className="hidden sm:flex gap-1">
						{menuItems.map((menu) => (
							<Button
								key={menu.id}
								variant={menu.active ? "flat" : "light"}
								color={menu.active ? "primary" : "default"}
								size="sm"
								startContent={renderLucideIcon(menu.icon, "w-4 h-4", 16)}
								onPress={() => onClickMenu(menu.id)}
							>
								{menu.label}
							</Button>
						))}
					</div>
				</NavbarContent>

				{/* 우측: 컨텍스트 선택 + 사용자 메뉴 */}
				<NavbarContent justify="end" className="gap-2">
					{/* 추가 컨텐츠 */}
					{extraContent}

					{/* 컨텍스트 선택 드롭다운 */}
					{currentContext && onChangeContext && (
						<Dropdown>
							<DropdownTrigger>
								<Button
									variant="bordered"
									size="sm"
									endContent={renderLucideIcon("ChevronDown", "w-4 h-4", 16)}
								>
									{currentContext.name}
								</Button>
							</DropdownTrigger>
							<DropdownMenu aria-label="컨텍스트 선택">
								<DropdownItem
									key="change-context"
									startContent={renderLucideIcon("RefreshCw", "w-4 h-4", 16)}
									onPress={onChangeContext}
								>
									{changeContextText}
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					)}

					{/* 사용자 메뉴 드롭다운 */}
					{currentUser && (
						<Dropdown placement="bottom-end">
							<DropdownTrigger>
								<Avatar
									as="button"
									className="transition-transform"
									color="primary"
									name={currentUser.name}
									size="sm"
									src={currentUser.avatarUrl}
								/>
							</DropdownTrigger>
							<DropdownMenu aria-label="사용자 메뉴">
								<DropdownItem
									key="profile"
									className="h-14 gap-2"
									textValue="프로필"
								>
									<p className="font-semibold">{currentUser.name}</p>
									<p className="text-sm text-default-500">{currentUser.role}</p>
								</DropdownItem>
								<DropdownItem
									key="logout"
									color="danger"
									startContent={renderLucideIcon("LogOut", "w-4 h-4", 16)}
									onPress={onLogout}
								>
									로그아웃
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					)}
				</NavbarContent>
			</Navbar>
		);
	},
);

TopNav.displayName = "TopNav";

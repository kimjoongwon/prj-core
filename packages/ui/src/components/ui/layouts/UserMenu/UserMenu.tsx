import {
	Avatar,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { renderLucideIcon } from "../../../../utils";

/**
 * 사용자 정보 인터페이스
 */
export interface UserMenuUser {
	id: string;
	name: string;
	role: string;
	avatarUrl?: string;
}

export interface UserMenuProps {
	/** 현재 사용자 */
	user: UserMenuUser | null;
	/** 로그아웃 핸들러 */
	onLogout: () => void;
}

/**
 * UserMenu 컴포넌트
 * Header의 rightContent로 사용하는 사용자 메뉴
 *
 * @example
 * ```tsx
 * <Header logo={<Logo />} rightContent={<UserMenu user={currentUser} onLogout={onLogout} />}>
 *   <Nav items={menuItems} onClickMenu={onClickMenu} />
 * </Header>
 * ```
 */
export const UserMenu = observer<UserMenuProps>(({ user, onLogout }) => {
	if (!user) {
		return null;
	}

	return (
		<Dropdown placement="bottom-end">
			<DropdownTrigger>
				<Avatar
					as="button"
					className="transition-transform"
					color="primary"
					name={user.name}
					size="sm"
					src={user.avatarUrl}
				/>
			</DropdownTrigger>
			<DropdownMenu aria-label="사용자 메뉴">
				<DropdownItem key="profile" className="h-14 gap-2" textValue="프로필">
					<p className="font-semibold">{user.name}</p>
					<p className="text-sm text-default-500">{user.role}</p>
				</DropdownItem>
				<DropdownItem
					key="logout"
					color="danger"
					startContent={renderLucideIcon("LogOut", "h-4 w-4", 16)}
					onPress={onLogout}
				>
					로그아웃
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
});

UserMenu.displayName = "UserMenu";

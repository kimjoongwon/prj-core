"use client";

import { useAuthStore, usePersistStore } from "@cocrepo/store";
import {
	Avatar,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { renderLucideIcon } from "../../../utils/iconUtils";

/**
 * UserMenu Feature 컴포넌트
 * Header의 right 영역에 사용
 * 사용자 정보 표시 및 로그아웃 기능을 제공합니다.
 *
 * @example
 * ```tsx
 * <Header right={<UserMenu />} />
 * ```
 */
export const UserMenu = observer(() => {
	const authStore = useAuthStore();
	const persistStore = usePersistStore();

	// 임시 사용자 정보 (추후 authStore에서 가져오도록 수정)
	const user = {
		id: "1",
		name: "관리자",
		role: "최고 관리자",
		avatarUrl: undefined as string | undefined,
	};

	const handleLogout = () => {
		// PersistStore를 통해 영속 데이터 초기화
		persistStore.clearSpace();
		// 세션 스토리지 정리
		if (typeof window !== "undefined") {
			sessionStorage.removeItem("adminRole");
		}
		// AuthStore를 통해 로그아웃 처리
		authStore.logout();
	};

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
					onPress={handleLogout}
				>
					로그아웃
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
});

UserMenu.displayName = "UserMenu";

// 하위 호환성을 위한 타입 export
export interface UserMenuUser {
	id: string;
	name: string;
	role: string;
	avatarUrl?: string;
}

export type UserMenuProps = {};

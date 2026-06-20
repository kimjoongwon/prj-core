"use client";

import { useAuthStore, usePersistStore } from "@cocrepo/store";
import { Avatar, Dropdown } from "@heroui/react";
import { LogOut } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";

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
	const t = useT();
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
		<Dropdown>
			<Dropdown.Trigger>
				<Avatar className="transition-transform" color="accent" size="sm">
					{user.avatarUrl ? (
						<Avatar.Image src={user.avatarUrl} alt={user.name} />
					) : null}
					<Avatar.Fallback>{user.name.slice(0, 1)}</Avatar.Fallback>
				</Avatar>
			</Dropdown.Trigger>
			<Dropdown.Popover placement="bottom end">
				<Dropdown.Menu aria-label={t("사용자 메뉴")}>
					<Dropdown.Item
						id="profile"
						key="profile"
						className="h-14 gap-2"
						textValue={t("프로필")}
					>
						<p className="font-semibold">{user.name}</p>
						<p className="text-sm text-muted">{user.role}</p>
					</Dropdown.Item>
					<Dropdown.Item
						id="logout"
						key="logout"
						className="text-danger"
						onAction={handleLogout}
					>
						<span className="flex items-center gap-2">
							<LogOut className="h-4 w-4" size={16} />
							{t("로그아웃")}
						</span>
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown.Popover>
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

export type UserMenuProps = Record<string, never>;

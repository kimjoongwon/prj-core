import { Avatar, Dropdown } from "@heroui/react";

/**
 * User 컴포넌트
 * 사용자 아바타와 드롭다운 메뉴를 표시하는 기본 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <User />
 * ```
 *
 * @deprecated Avatar 컴포넌트를 사용하세요.
 */
export const User = () => {
	return (
		<Dropdown>
			<Dropdown.Trigger>
				<div className="flex items-center gap-2 rounded-lg px-2 py-1">
					<Avatar size="sm">
						<Avatar.Fallback>h</Avatar.Fallback>
					</Avatar>
					<span className="text-sm font-medium text-foreground">hah</span>
				</div>
			</Dropdown.Trigger>
			<Dropdown.Menu>
				<Dropdown.Item id="profile" className="h-14 gap-2">
					<p className="font-semibold">Signed in as</p>
					{/* <p className="font-semibold">{email}</p> */}
				</Dropdown.Item>
				<Dropdown.Item id="space" className="h-14 gap-2">
					{/* <p className="font-semibold">소속: {auth.user?.email}</p> */}
					<p className="font-semibold">설정</p>
				</Dropdown.Item>
				<Dropdown.Item id="logout" className="text-danger">
					로그아웃
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
};

import {
	User as BaseUser,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/react";


export const User = (() => {
	return (
		<Dropdown>
			<DropdownTrigger>
				<BaseUser
					isFocusable
					name={"hah"}
					avatarProps={{
						size: "sm",
						isBordered: true,
						isFocusable: true,
						as: "button",
					}}
				/>
			</DropdownTrigger>
			<DropdownMenu variant="flat">
				<DropdownItem key="profile" className="h-14 gap-2">
					<p className="font-semibold">Signed in as</p>
					{/* <p className="font-semibold">{email}</p> */}
				</DropdownItem>
				<DropdownItem key="space" className="h-14 gap-2">
					{/* <p className="font-semibold">소속: {auth.user?.email}</p> */}
					<DropdownItem key="setting">설정</DropdownItem>
				</DropdownItem>
				<DropdownItem key="logout" color="danger" className="text-danger">
					로그아웃
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
});

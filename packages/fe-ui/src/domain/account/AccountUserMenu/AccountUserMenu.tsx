"use client";

import { Avatar, Dropdown } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { useT } from "../../../i18n";
import { AccountLogoutButton } from "../AccountLogoutButton";

const userInfo: {
	name: string;
	avatarUrl?: string;
	role?: string;
} = {
	name: "관리자",
	role: "Owner",
} as const;

/** 계정 사용자 정보와 로그아웃 동작을 소유하는 account domain 메뉴입니다. */
export const AccountUserMenu = () => {
	const t = useT();

	return (
		<Dropdown>
			<Dropdown.Trigger
				aria-label={t("사용자 메뉴")}
				className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-surface px-2 pr-3 text-foreground hover:bg-surface-hover"
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
				<Dropdown.Menu aria-label={t("사용자 메뉴")}>
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
						<AccountLogoutButton />
					</Dropdown.Section>
				</Dropdown.Menu>
			</Dropdown.Popover>
		</Dropdown>
	);
};

AccountUserMenu.displayName = "AccountUserMenu";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import type { ReactNode } from "react";

export interface HeaderProps {
	/** 로고 영역 */
	logo?: ReactNode;
	/** 네비게이션 영역 - children으로 전달 */
	children?: ReactNode;
	/** 우측 영역 (사용자 메뉴, 알림 등) */
	rightContent?: ReactNode;
}

/**
 * Header 컴포넌트
 * 영역만 정의하는 순수 레이아웃 컴포넌트
 *
 * @example
 * ```tsx
 * <Header
 *   logo={<Logo icon="LayoutGrid" text="Admin" onClick={onClickLogo} />}
 *   rightContent={<UserMenu user={currentUser} onLogout={onLogout} />}
 * >
 *   <Nav items={menuItems} onClickMenu={onClickMenu} />
 * </Header>
 * ```
 */
export const Header = ({ logo, children, rightContent }: HeaderProps) => {
	return (
		<Navbar
			className="border-divider border-b bg-background/70 backdrop-blur-md"
			maxWidth="full"
			height="4rem"
			isBordered
		>
			<div className="flex w-full items-center">
				{/* 로고 영역 */}
				<NavbarBrand className="flex-shrink-0">{logo}</NavbarBrand>

				{/* 네비게이션 영역 - children */}
				<NavbarContent className="flex-1 gap-1" justify="start">
					{children}
				</NavbarContent>

				{/* 우측 영역 */}
				<NavbarContent className="flex-shrink-0 gap-2" justify="end">
					<NavbarItem>{rightContent}</NavbarItem>
				</NavbarContent>
			</div>
		</Navbar>
	);
};

Header.displayName = "Header";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import type { ReactNode } from "react";

export interface HeaderProps {
	/** 좌측 영역 */
	left?: ReactNode;
	/** 중앙 영역 */
	center?: ReactNode;
	/** 우측 영역 */
	right?: ReactNode;
	/** 하단 영역 */
	bottom?: ReactNode;
}

/**
 * Header 컴포넌트
 * 영역만 정의하는 순수 레이아웃 컴포넌트
 *
 * @example
 * ```tsx
 * <Header
 *   left={<Logo />}
 *   center={<Nav />}
 *   right={<UserMenu />}
 *   bottom={<SubNav />}
 * />
 * ```
 */
export const Header = ({ left, center, right, bottom }: HeaderProps) => {
	return (
		<div className="flex flex-col">
			<Navbar
				className="border-divider border-b bg-background/70 backdrop-blur-md"
				maxWidth="full"
				height="4rem"
				isBordered={!bottom}
			>
				<div className="flex w-full items-center">
					{/* 좌측 영역 */}
					<NavbarBrand className="flex-shrink-0">{left}</NavbarBrand>

					{/* 중앙 영역 */}
					<NavbarContent className="flex-1 gap-1" justify="start">
						{center}
					</NavbarContent>

					{/* 우측 영역 */}
					<NavbarContent className="flex-shrink-0 gap-2" justify="end">
						<NavbarItem className="flex items-center gap-2">{right}</NavbarItem>
					</NavbarContent>
				</div>
			</Navbar>
			{/* 하단 영역 */}
			{bottom}
		</div>
	);
};

Header.displayName = "Header";

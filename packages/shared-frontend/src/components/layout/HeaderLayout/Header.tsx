import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import type { ReactNode } from "react";

export interface HeaderProps {
	left?: ReactNode;
	center?: ReactNode;
	right?: ReactNode;
}

export const Header = (props: HeaderProps) => {
	const { left, center, right } = props;

	return (
		<Navbar
			className="border-b border-divider bg-background/70 backdrop-blur-md"
			maxWidth="full"
			height="4rem"
			isBordered
		>
			{/* Desktop Layout */}
			<div className="flex w-full items-center">
				<NavbarBrand className="flex-1">{left}</NavbarBrand>

				<NavbarContent className="flex-1" justify="center">
					{center}
				</NavbarContent>

				<NavbarContent className="flex-1" justify="end">
					<NavbarItem>{right}</NavbarItem>
				</NavbarContent>
			</div>
		</Navbar>
	);
};

Header.displayName = "Header";

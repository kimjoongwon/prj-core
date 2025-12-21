import { Link } from "@heroui/react";
import { useCallback, useMemo } from "react";
import { Button } from "../Button/Button";

export interface NavbarItemProps {
	url: string;
	label: string;
	value: string;
	onChange: (href: string) => void;
}

export const NavbarItem = (props: NavbarItemProps) => {
	const { label = "미입력", value, onChange } = props;

	// Check if current path matches the value
	const isActive = useMemo(() => {
		return window.location.pathname === value;
	}, [value]);

	// Handle click event
	const handleClick = useCallback(() => {
		if (onChange) {
			onChange(value);
		}
	}, [onChange, value]);

	return (
		<Link
			as={Button}
			variant="light"
			color={isActive ? "primary" : "foreground"}
			onPress={handleClick}
		>
			{label}
		</Link>
	);
};

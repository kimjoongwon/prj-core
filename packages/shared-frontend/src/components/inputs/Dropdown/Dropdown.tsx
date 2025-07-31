import {
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Dropdown as HeroUIDropdown,
	DropdownItemProps as HeroUIDropdownItemProps,
	DropdownProps as HeroUIDropdownProps,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import React from "react";

export interface DropdownItemProps
	extends Omit<HeroUIDropdownItemProps, "children"> {
	key: string;
	label: string;
}

export interface DropdownProps
	extends Omit<HeroUIDropdownProps, "children" | "trigger"> {
	trigger: React.ReactNode;
	dropdownItems: DropdownItemProps[];
	onAction?: (key: string) => void;
}

const DropdownComponent = (props: DropdownProps) => {
	const { trigger, dropdownItems, onAction, ...dropdownProps } = props;

	const handleAction = (key: React.Key) => {
		onAction?.(String(key));
	};

	return (
		<HeroUIDropdown {...dropdownProps}>
			<DropdownTrigger>{trigger}</DropdownTrigger>
			<DropdownMenu
				aria-label="Dropdown menu"
				onAction={handleAction}
				variant="flat"
			>
				{dropdownItems.map(({ key, label, ...itemProps }) => (
					<DropdownItem key={key} {...itemProps}>
						{label}
					</DropdownItem>
				))}
			</DropdownMenu>
		</HeroUIDropdown>
	);
};

DropdownComponent.displayName = "Dropdown";

export const Dropdown = observer(DropdownComponent);

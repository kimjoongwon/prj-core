import type React from "react";
import {
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Dropdown as HeroUIDropdown,
	type DropdownItemProps as HeroUIDropdownItemProps,
	type DropdownProps as HeroUIDropdownProps,
} from "../../design-system/primitives";

export interface DropdownItemProps
	extends Omit<HeroUIDropdownItemProps, "children"> {
	/** 아이템 고유 키 */
	key: string;
	/** 표시 텍스트 */
	label: string;
}

export interface DropdownProps
	extends Omit<HeroUIDropdownProps, "children" | "trigger"> {
	/** 드롭다운을 여는 트리거 요소 */
	trigger: React.ReactNode;
	/** 드롭다운 메뉴 아이템 목록 */
	dropdownItems: DropdownItemProps[];
	/** 아이템 선택 핸들러 */
	onAction?: (key: string) => void;
}

/**
 * Dropdown 컴포넌트
 * 트리거 클릭 시 메뉴 목록을 표시합니다.
 *
 * @example
 * ```tsx
 * const items = [
 *   { key: "edit", label: "수정" },
 *   { key: "delete", label: "삭제", color: "danger" },
 * ];
 *
 * <Dropdown
 *   trigger={<Button>메뉴</Button>}
 *   dropdownItems={items}
 *   onAction={(key) => handleAction(key)}
 * />
 * ```
 */
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

export const Dropdown = DropdownComponent;

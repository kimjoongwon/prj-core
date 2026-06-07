import {
	Dropdown as HeroUIDropdown,
	cn,
} from "@heroui/react";
import {
	isValidElement,
	type ComponentProps,
	type Key,
	type ReactNode,
} from "react";

export interface DropdownEntryProps
	extends Omit<ComponentProps<typeof HeroUIDropdown.Item>, "children"> {
	/** 아이템 고유 키 */
	key: string;
	/** 표시 텍스트 */
	label: string;
	/** 보조 설명 */
	description?: string;
	color?: "default" | "danger";
	startContent?: ReactNode;
	endContent?: ReactNode;
}

export interface DropdownProps
	extends Omit<ComponentProps<typeof HeroUIDropdown>, "children" | "trigger"> {
	/** 드롭다운을 여는 트리거 요소 */
	trigger: ReactNode;
	/** 드롭다운 메뉴 아이템 목록 */
	dropdownItems: DropdownEntryProps[];
	/** 아이템 선택 핸들러 */
	onAction?: (key: string) => void;
	placement?: ComponentProps<typeof HeroUIDropdown.Popover>["placement"];
}

interface DropdownTriggerElementProps {
	children?: ReactNode;
	className?: string;
	isIconOnly?: boolean;
	size?: string;
	variant?: string;
}

const getTriggerElement = (trigger: ReactNode) => {
	if (!isValidElement<DropdownTriggerElementProps>(trigger)) {
		return {
			className: undefined,
			content: trigger,
			isIconOnly: false,
			size: undefined,
			variant: undefined,
		};
	}

	if (typeof trigger.type === "string" && trigger.type !== "button") {
		return {
			className: undefined,
			content: trigger,
			isIconOnly: false,
			size: undefined,
			variant: undefined,
		};
	}

	return {
		className: trigger.props.className,
		content: trigger.props.children ?? trigger,
		isIconOnly: trigger.props.isIconOnly,
		size: trigger.props.size,
		variant: trigger.props.variant,
	};
};

const getTriggerVariantClassName = (variant?: string) => {
	if (variant === "light") return "button--ghost";
	if (variant === "bordered") return "button--outline";
	if (variant === "flat" || variant === "faded") return "button--tertiary";
	return "button--primary";
};

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
	const { trigger, dropdownItems, onAction, placement, ...dropdownProps } = props;
	const triggerElement = getTriggerElement(trigger);

	const handleAction = (key: Key) => {
		onAction?.(String(key));
	};

	return (
		<HeroUIDropdown {...dropdownProps}>
			<HeroUIDropdown.Trigger
				className={cn(
					"button",
					triggerElement.size ? `button--${triggerElement.size}` : "button--md",
					getTriggerVariantClassName(triggerElement.variant),
					triggerElement.isIconOnly && "aspect-square p-0",
					triggerElement.className,
				)}
			>
				{triggerElement.content}
			</HeroUIDropdown.Trigger>
			<HeroUIDropdown.Popover placement={placement}>
				<HeroUIDropdown.Menu
					aria-label="Dropdown menu"
					onAction={handleAction}
				>
					{dropdownItems.map(
						({
							key,
							label,
							description,
							color,
							className,
							endContent,
							startContent,
							...itemProps
						}) => (
							<HeroUIDropdown.Item
								key={key}
								id={key}
								{...itemProps}
								className={cn(color === "danger" && "text-danger", className)}
							>
								<div className="flex items-center gap-2">
									{startContent}
									<div className="flex flex-col">
										<span>{label}</span>
										{description ? (
											<span className="text-xs text-muted">
												{description}
											</span>
										) : null}
									</div>
									{endContent}
								</div>
							</HeroUIDropdown.Item>
						),
					)}
				</HeroUIDropdown.Menu>
			</HeroUIDropdown.Popover>
		</HeroUIDropdown>
	);
};

DropdownComponent.displayName = "Dropdown";

export const Dropdown = DropdownComponent;

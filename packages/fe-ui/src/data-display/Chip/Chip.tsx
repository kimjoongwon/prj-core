import { Chip as HeroChip } from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";

export interface ChipProps
	extends Omit<ComponentProps<typeof HeroChip>, "children"> {
	children?: ReactNode;
	startContent?: ReactNode;
	endContent?: ReactNode;
	isDisabled?: boolean;
	onClose?: () => void;
}

/**
 * Chip 컴포넌트
 * HeroUI Chip의 래퍼 컴포넌트입니다.
 * color는 accent/danger/default/success/warning, variant는 primary/secondary/soft/tertiary를 받습니다.
 */
export function Chip(props: ChipProps) {
	const {
		children,
		endContent,
		isDisabled: _isDisabled,
		onClose: _onClose,
		startContent,
		...rest
	} = props;

	return (
		<HeroChip {...rest}>
			{startContent}
			{children}
			{endContent}
		</HeroChip>
	);
}

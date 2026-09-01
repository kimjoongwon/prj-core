import { Button as HeroButton } from "@heroui/react";
import { type ComponentProps, forwardRef, type ReactNode } from "react";

export interface ButtonProps
	extends Omit<ComponentProps<typeof HeroButton>, "children"> {
	children?: ReactNode;
	startContent?: ReactNode;
	endContent?: ReactNode;
	isLoading?: boolean;
	spinner?: ReactNode;
	radius?: string;
}

/**
 * HeroUI Button의 props와 스타일을 그대로 전달하는 프로젝트 공용 wrapper입니다.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	function Button(props, ref) {
		const {
			children,
			endContent,
			isLoading,
			radius: _radius,
			spinner,
			startContent,
			...buttonProps
		} = props;

		return (
			<HeroButton ref={ref} {...buttonProps}>
				{isLoading ? (spinner ?? null) : startContent}
				{children}
				{isLoading ? null : endContent}
			</HeroButton>
		);
	},
);

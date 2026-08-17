import { Button as HeroButton } from "@heroui/react";
import { forwardRef, type ComponentProps } from "react";

export type ButtonProps = ComponentProps<typeof HeroButton>;

/**
 * HeroUI Button의 props와 스타일을 그대로 전달하는 프로젝트 공용 wrapper입니다.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	function Button(props, ref) {
		return <HeroButton ref={ref} {...props} />;
	},
);

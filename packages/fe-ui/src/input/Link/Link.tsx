import { Link as HeroLink } from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";
import { translateNode, useT } from "../../i18n";

export type LinkProps = ComponentProps<typeof HeroLink>;

/**
 * Link 컴포넌트
 * HeroUI Link의 경량 래퍼로, input 레이어에서 재사용합니다.
 */
export const Link = (props: LinkProps) => {
	const t = useT();

	return (
		<HeroLink {...props}>
			{translateNode(props.children as ReactNode, t)}
		</HeroLink>
	);
};

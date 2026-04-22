import {
	Link as HeroUiLink,
	type LinkProps as HeroUiLinkProps,
} from "@heroui/react";

export type LinkProps = HeroUiLinkProps;

/**
 * Link 컴포넌트
 * HeroUI Link의 경량 래퍼로, control 레이어에서 재사용합니다.
 */
export const Link = (props: LinkProps) => {
	return <HeroUiLink {...props}>{props.children}</HeroUiLink>;
};

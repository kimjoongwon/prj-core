"use client";

import { observer } from "mobx-react-lite";
import {
	Link as HeroUiLink,
	type LinkProps as HeroUiLinkProps,
} from "../../design-system/primitives";
import { translateNode, useT } from "../../i18n";

export type LinkProps = HeroUiLinkProps;

/**
 * Link 컴포넌트
 * HeroUI Link의 경량 래퍼로, control 레이어에서 재사용합니다.
 */
export const Link = observer((props: LinkProps) => {
	const t = useT();

	return <HeroUiLink {...props}>{translateNode(props.children, t)}</HeroUiLink>;
});

"use client";

import {
	Link as HeroUiLink,
	type LinkProps as HeroUiLinkProps,
} from "@cocrepo/ui/heroui";
import { observer } from "mobx-react-lite";
import { translateNode, useT } from "../../i18n";

export type LinkProps = HeroUiLinkProps;

/**
 * Link 컴포넌트
 * HeroUI Link의 경량 래퍼로, control 레이어에서 재사용합니다.
 */
export const Link = observer(function Link(props: LinkProps) {
	const t = useT();
	const ariaLabel =
		typeof props["aria-label"] === "string"
			? t(props["aria-label"])
			: props["aria-label"];
	const title = typeof props.title === "string" ? t(props.title) : props.title;

	return (
		<HeroUiLink {...props} aria-label={ariaLabel} title={title}>
			{translateNode(props.children, t)}
		</HeroUiLink>
	);
});

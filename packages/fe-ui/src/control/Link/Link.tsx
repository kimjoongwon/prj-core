"use client";

import { Link as HeroLink } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps, ReactNode } from "react";
import { translateNode, useT } from "../../i18n";

export type LinkProps = ComponentProps<typeof HeroLink>;

/**
 * Link 컴포넌트
 * HeroUI Link의 경량 래퍼로, control 레이어에서 재사용합니다.
 */
export const Link = observer((props: LinkProps) => {
	const t = useT();

	return (
		<HeroLink {...props}>
			{translateNode(props.children as ReactNode, t)}
		</HeroLink>
	);
});

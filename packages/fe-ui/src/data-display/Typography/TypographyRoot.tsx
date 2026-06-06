"use client";

import { Typography as HeroTypography } from "@heroui/react/typography";
import { observer } from "mobx-react-lite";
import { translateNode, useT } from "../../i18n";
import type { TypographyRootProps } from "./TypographyRoot.props";

export const TypographyRoot = observer((props: TypographyRootProps) => {
	const t = useT();
	const { children, ...rest } = props;

	return (
		<HeroTypography.Root {...rest}>
			{translateNode(children, t)}
		</HeroTypography.Root>
	);
});

TypographyRoot.displayName = "TypographyRoot";

"use client";

import { Typography as HeroTypography } from "@heroui/react/typography";
import { observer } from "mobx-react-lite";
import { translateNode, useT } from "../../i18n";
import type { TypographyProseProps } from "./TypographyProse.props";

export const TypographyProse = observer((props: TypographyProseProps) => {
	const t = useT();
	const { children, ...rest } = props;

	return (
		<HeroTypography.Prose {...rest}>
			{translateNode(children, t)}
		</HeroTypography.Prose>
	);
});

TypographyProse.displayName = "TypographyProse";

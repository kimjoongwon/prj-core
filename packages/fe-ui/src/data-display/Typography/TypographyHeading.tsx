"use client";

import { Typography as HeroTypography } from "@heroui/react/typography";
import { observer } from "mobx-react-lite";
import { translateNode, useT } from "../../i18n";
import type { TypographyHeadingProps } from "./TypographyHeading.props";

export const TypographyHeading = observer((props: TypographyHeadingProps) => {
	const t = useT();
	const { children, ...rest } = props;

	return (
		<HeroTypography.Heading {...rest}>
			{translateNode(children, t)}
		</HeroTypography.Heading>
	);
});

TypographyHeading.displayName = "TypographyHeading";

"use client";

import { Typography as HeroTypography } from "@heroui/react/typography";
import { observer } from "mobx-react-lite";
import { translateNode, useT } from "../../i18n";
import type { TypographyCodeProps } from "./TypographyCode.props";

export const TypographyCode = observer((props: TypographyCodeProps) => {
	const t = useT();
	const { children, ...rest } = props;

	return (
		<HeroTypography.Code {...rest}>{translateNode(children, t)}</HeroTypography.Code>
	);
});

TypographyCode.displayName = "TypographyCode";

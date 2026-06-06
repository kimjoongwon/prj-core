"use client";

import { Typography as HeroTypography } from "@heroui/react/typography";
import { observer } from "mobx-react-lite";
import { translateNode, useT } from "../../i18n";
import type { TypographyParagraphProps } from "./TypographyParagraph.props";

export const TypographyParagraph = observer(
	(props: TypographyParagraphProps) => {
		const t = useT();
		const { children, ...rest } = props;

		return (
			<HeroTypography.Paragraph {...rest}>
				{translateNode(children, t)}
			</HeroTypography.Paragraph>
		);
	},
);

TypographyParagraph.displayName = "TypographyParagraph";

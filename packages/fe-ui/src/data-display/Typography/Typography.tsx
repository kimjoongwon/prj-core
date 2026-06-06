"use client";

import { TypographyCode } from "./TypographyCode";
import { TypographyHeading } from "./TypographyHeading";
import { TypographyParagraph } from "./TypographyParagraph";
import { TypographyProse } from "./TypographyProse";
import { TypographyRoot } from "./TypographyRoot";

export const Typography = Object.assign(TypographyRoot, {
	Code: TypographyCode,
	Heading: TypographyHeading,
	Paragraph: TypographyParagraph,
	Prose: TypographyProse,
	Root: TypographyRoot,
});

Typography.displayName = "Typography";

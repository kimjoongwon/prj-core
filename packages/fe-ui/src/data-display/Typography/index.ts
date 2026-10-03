/**
 * HeroUI Typography의 순수 재수출입니다.
 *
 * - 웹의 모든 텍스트는 이 경로의 `Typography`(`type`, `weight`, `align`, `color`,
 *   `truncate`, `render`)와 compound(`Heading`, `Paragraph`, `Code`, `Prose`)를 통과합니다.
 * - 래퍼 로직(i18n 자동 번역, observer)은 없습니다. 번역은 호출부에서 `useT()`로
 *   명시하고, 이 역할은 레이아웃/화면 소유자(`Screen.Header`, `Section.Header` 등)가
 *   자기 props에 적용합니다.
 * - 공식 문서: https://heroui.com/en/docs/react/components/typography
 */
export { Typography, typographyVariants } from "@heroui/react/typography";
export type {
	CodeProps as TypographyCodeProps,
	HeadingProps as TypographyHeadingProps,
	ParagraphProps as TypographyParagraphProps,
	ProseProps as TypographyProseProps,
	TypographyProps,
	TypographyRootProps,
	TypographyVariants,
} from "@heroui/react/typography";

import {
	type ChipProps,
	Chip as NextUIChip,
} from "../../../design-system/primitives";

/**
 * Chip 컴포넌트
 * HeroUI Chip의 래퍼 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <Chip>기본</Chip>
 *
 * // 색상 적용
 * <Chip color="primary">Primary</Chip>
 * <Chip color="success">성공</Chip>
 * <Chip color="danger">위험</Chip>
 *
 * // 변형
 * <Chip variant="flat">Flat</Chip>
 * <Chip variant="bordered">Bordered</Chip>
 * ```
 */
export function Chip(props: ChipProps) {
	const { children } = props;
	return <NextUIChip {...props}>{children}</NextUIChip>;
}

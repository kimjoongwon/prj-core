import { Link, type LinkProps } from "@heroui/react";

interface LinkCellViewProps extends LinkProps {
	/** 링크 텍스트 */
	value: string;
}

/**
 * LinkCell 컴포넌트
 * 클릭 가능한 링크로 값을 표시합니다.
 *
 * @example
 * ```tsx
 * <LinkCell value="상세보기" href="/users/123" />
 * <LinkCell value="외부 링크" href="https://example.com" isExternal />
 * ```
 */
export const LinkCell = (props: LinkCellViewProps) => {
	const { value, ...linkProps } = props;
	return <Link {...linkProps}>{value}</Link>;
};

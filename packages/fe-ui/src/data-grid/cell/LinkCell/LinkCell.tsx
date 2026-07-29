import type { ReactNode } from "react";
import { Link, type LinkProps } from "../../../input/Link/Link";

export interface LinkCellProps extends Omit<LinkProps, "children" | "href"> {
	/** 링크 대상 경로 */
	href?: LinkProps["href"];
	/** 링크에 표시할 내용 */
	children?: ReactNode;
}

/**
 * DataGrid 셀 안에서 링크를 표시합니다.
 * href 또는 표시할 내용이 없으면 링크 대신 빈 값 표기를 렌더링합니다.
 */
export const LinkCell = ({
	href,
	children,
	className,
	...linkProps
}: LinkCellProps) => {
	const isEmpty =
		!href || children === null || children === undefined || children === "";

	if (isEmpty) {
		return <span className="text-muted">-</span>;
	}

	return (
		<Link
			{...linkProps}
			href={href}
			className={className ?? "text-accent hover:underline"}
		>
			{children}
		</Link>
	);
};

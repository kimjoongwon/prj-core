import type { ReactNode } from "react";
import { Typography } from "../../../data-display/Typography";
import { Link, type LinkProps } from "../../../input/Link/Link";

export interface LinkCellProps extends Omit<LinkProps, "children" | "href"> {
	/** 링크 대상 경로 */
	href?: LinkProps["href"];
	/** 링크에 표시할 내용 */
	children?: ReactNode;
}

/** 셀 마크업(text-[13px])과 동일한 크기를 유지하는 폴백 클래스입니다. */
const DATA_CELL_SIZE_FALLBACK_CLASS_NAME = "text-[13px]";

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
		return (
			<Typography
				className={DATA_CELL_SIZE_FALLBACK_CLASS_NAME}
				color="muted"
				type="body-sm"
			>
				-
			</Typography>
		);
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

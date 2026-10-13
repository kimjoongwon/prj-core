"use client";

import { observer } from "mobx-react-lite";
import { Typography } from "../../../data-display/Typography";
import { useHandlers } from "./useHandlers";

export interface DefaultCellProps {
	/** 표시할 값 */
	value?: string | number | bigint | null;
	/** 빈 값일 때 대체 텍스트 */
	placeholder?: string;
	/** 모노스페이스 렌더링 여부 */
	mono?: boolean;
	/** 텍스트 크기 */
	size?: "sm" | "xs";
	/** 텍스트 톤 */
	tone?: "default" | "muted";
	/** 텍스트 굵기 */
	weight?: "normal" | "medium" | "semibold";
	/** 한 줄 말줄임 여부 */
	truncate?: boolean;
	/** line clamp 줄 수 */
	lineClamp?: 1 | 2;
	/** 숫자 정렬용 tabular-nums 적용 여부 */
	tabular?: boolean;
	/** 추가 클래스 */
	className?: string;
	/** title 속성 */
	title?: string;
}

/**
 * DefaultCell 컴포넌트
 * 기본 텍스트/숫자 값을 표시합니다. 빈 값은 "-"로 표시됩니다.
 *
 * @example
 * ```tsx
 * <DefaultCell value="홍길동" />
 * <DefaultCell value={123} mono />
 * <DefaultCell value="" /> // "-"
 * ```
 */
export const DefaultCell = observer(function DefaultCell(
	state: DefaultCellProps,
) {
	const {
		mono = false,
		size = "sm",
		tone = "default",
		weight = "normal",
		truncate = false,
		lineClamp,
		tabular = false,
		className,
	} = state;
	const handlers = useHandlers(state);
	const { isEmptyValue, translatedDisplayValue, translatedTitle } =
		handlers.getDisplayPresentation();

	return (
		<div className="min-w-0">
			<Typography
				className={[
					mono && "font-mono",
					tabular && "tabular-nums",
					lineClamp === 1 && "line-clamp-1",
					lineClamp === 2 && "line-clamp-2",
					className,
				]
					.filter(Boolean)
					.join(" ")}
				color={isEmptyValue || tone === "muted" ? "muted" : "default"}
				title={translatedTitle}
				truncate={truncate}
				type={size === "xs" ? "body-xs" : "body-sm"}
				weight={weight === "normal" ? undefined : weight}
			>
				{translatedDisplayValue}
			</Typography>
		</div>
	);
});

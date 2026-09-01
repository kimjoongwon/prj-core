"use client";

import { observer } from "mobx-react-lite";
import { type Translate, useT } from "../../../i18n";

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

const joinClassNames = (...values: Array<string | false | null | undefined>) =>
	values.filter(Boolean).join(" ");

function translateDisplayValue(value: string, t: Translate) {
	const minutesSeconds = value.match(/^(\d+)분\s+(\d+)초$/);
	if (minutesSeconds) {
		return t("{{minutes}}분 {{seconds}}초", undefined, {
			minutes: minutesSeconds[1],
			seconds: minutesSeconds[2],
		});
	}

	const seconds = value.match(/^(\d+)초$/);
	if (seconds) {
		return t("{{seconds}}초", undefined, { seconds: seconds[1] });
	}

	const count = value.match(/^(\d+)회$/);
	if (count) {
		return t("{{count}}회", undefined, { count: count[1] });
	}

	const itemCount = value.match(/^(\d+)개$/);
	if (itemCount) {
		return t("{{count}}개", undefined, { count: itemCount[1] });
	}

	return t(value);
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
export const DefaultCell = observer(function DefaultCell({
	value,
	placeholder = "-",
	mono = false,
	size = "sm",
	tone = "default",
	weight = "normal",
	truncate = false,
	lineClamp,
	tabular = false,
	className,
	title,
}: DefaultCellProps) {
	const t = useT();
	const isEmptyValue = value === null || value === undefined || value === "";
	const displayValue = isEmptyValue ? placeholder : String(value);
	const translatedDisplayValue = translateDisplayValue(displayValue, t);
	const translatedTitle = title ? t(title) : title;

	return (
		<div className="min-w-0">
			<span
				className={joinClassNames(
					"block",
					size === "xs" ? "text-xs" : "text-sm",
					isEmptyValue
						? "text-muted"
						: tone === "muted"
							? "text-muted"
							: "text-foreground",
					mono && "font-mono",
					tabular && "tabular-nums",
					weight === "medium" && "font-medium",
					weight === "semibold" && "font-semibold",
					truncate && "truncate",
					lineClamp === 1 && "line-clamp-1",
					lineClamp === 2 && "line-clamp-2",
					className,
				)}
				title={translatedTitle}
			>
				{translatedDisplayValue}
			</span>
		</div>
	);
});

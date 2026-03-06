"use client";

import { cn } from "@heroui/react";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { observer } from "mobx-react-lite";

export type SortDirection = "asc" | "desc";

export type SortDescriptor = {
	column: string;
	direction: SortDirection;
};

/** 복합 정렬 상태 */
export type MultiSortDescriptor = SortDescriptor[];

/** 정렬 이벤트 */
export type SortEvent = {
	column: string;
	shiftKey: boolean;
	ctrlKey: boolean;
};

export interface SortableColumnHeaderProps {
	/** 컬럼 ID */
	columnId: string;
	/** 헤더 라벨 */
	label: React.ReactNode;
	/** 현재 정렬 상태 */
	sortDescriptor?: MultiSortDescriptor;
	/** 정렬 변경 핸들러 */
	onSortChange?: (event: SortEvent) => void;
	/** 정렬 가능 여부 */
	sortable?: boolean;
}

/**
 * 정렬 가능한 컬럼 헤더 컴포넌트
 *
 * 복합 정렬 지원:
 * - 일반 클릭: 단일 정렬 (asc → desc → 해제)
 * - Shift+클릭: 복합 정렬에 추가/토글
 * - Ctrl+클릭: 해당 컬럼 정렬 제거
 */
export const SortableColumnHeader = observer(function SortableColumnHeader({
	columnId,
	label,
	sortDescriptor = [],
	onSortChange,
	sortable = true,
}: SortableColumnHeaderProps) {
	const currentSort = sortDescriptor.find((s) => s.column === columnId);
	const sortIndex = sortDescriptor.findIndex((s) => s.column === columnId);
	const isMultiSort = sortDescriptor.length > 1;

	const handleClick = (e: React.MouseEvent) => {
		if (!sortable || !onSortChange) return;

		onSortChange({
			column: columnId,
			shiftKey: e.shiftKey,
			ctrlKey: e.ctrlKey || e.metaKey, // metaKey for Mac Cmd
		});
	};

	if (!sortable) {
		return <span>{label}</span>;
	}

	return (
		<button
			type="button"
			onClick={handleClick}
			className={cn(
				"flex items-center gap-1 hover:text-foreground transition-colors",
				currentSort ? "text-primary" : "text-foreground/70",
			)}
		>
			<span>{label}</span>
			<span className="flex items-center">
				{currentSort ? (
					<>
						{currentSort.direction === "asc" ? (
							<ChevronUp className="h-4 w-4" />
						) : (
							<ChevronDown className="h-4 w-4" />
						)}
						{isMultiSort && (
							<span className="ml-0.5 text-xs text-primary/70">
								{sortIndex + 1}
							</span>
						)}
					</>
				) : (
					<ChevronsUpDown className="h-4 w-4 opacity-50" />
				)}
			</span>
		</button>
	);
});

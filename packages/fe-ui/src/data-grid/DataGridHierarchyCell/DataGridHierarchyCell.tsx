"use client";

import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { ChevronRight, GripVertical } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../../input/Button/Button";
import { joinClassNames } from "../internal/classNames";

export interface DataGridHierarchyCellProps {
	children: ReactNode;
	depth: number;
	rowLabel: string;
	canExpand: boolean;
	isExpanded: boolean;
	onToggle: () => void;
	dragHandle?: {
		attributes: DraggableAttributes;
		listeners: SyntheticListenerMap | undefined;
	};
}

/** 계층 행의 이동 핸들, 들여쓰기, 펼침 버튼과 실제 셀 내용을 조합합니다. */
export function DataGridHierarchyCell({
	children,
	depth,
	rowLabel,
	canExpand,
	isExpanded,
	onToggle,
	dragHandle,
}: DataGridHierarchyCellProps) {
	return (
		<div
			className="flex min-w-0 items-center gap-1"
			style={{ paddingLeft: `${depth * 18}px` }}
		>
			{dragHandle ? (
				<Button
					{...dragHandle.attributes}
					{...dragHandle.listeners}
					aria-label={`${rowLabel} 행 이동`}
					className="size-6 min-w-6 touch-none cursor-grab rounded p-1 text-muted active:cursor-grabbing"
					isIconOnly
					size="sm"
					variant="light"
					onClick={(event) => event.stopPropagation()}
				>
					<GripVertical className="size-4" />
				</Button>
			) : null}
			{canExpand ? (
				<Button
					aria-expanded={isExpanded}
					aria-label={`${rowLabel} 하위 행 ${isExpanded ? "접기" : "펼치기"}`}
					className="size-6 min-w-6 rounded p-1 text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
					isIconOnly
					size="sm"
					variant="light"
					onClick={(event) => event.stopPropagation()}
					onPress={onToggle}
				>
					<ChevronRight
						className={joinClassNames(
							"size-4 transition-transform",
							isExpanded && "rotate-90",
						)}
					/>
				</Button>
			) : (
				<span aria-hidden="true" className="size-6 shrink-0" />
			)}
			<div className="min-w-0 flex-1">{children}</div>
		</div>
	);
}

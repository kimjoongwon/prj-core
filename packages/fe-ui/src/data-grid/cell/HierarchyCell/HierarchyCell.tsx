"use client";

import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { ChevronRight, GripVertical } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../../../input/Button/Button";

export interface HierarchyCellProps {
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
export function HierarchyCell({
	children,
	depth,
	rowLabel,
	canExpand,
	isExpanded,
	onToggle,
	dragHandle,
}: HierarchyCellProps) {
	const controlOffset = dragHandle ? 24 : 0;
	const railWidth = controlOffset + depth * 18 + 24;

	return (
		<div className="relative flex min-h-10 min-w-0 items-stretch gap-2">
			<div
				className="relative flex shrink-0 self-stretch items-center gap-1"
				style={{ width: `${railWidth}px` }}
			>
				<span
					aria-hidden="true"
					className="shrink-0"
					style={{ width: `${depth * 18}px` }}
				/>
				{dragHandle ? (
						<Button
							{...dragHandle.attributes}
							{...dragHandle.listeners}
							aria-label={`${rowLabel} 행 이동`}
							className="size-6 min-w-6 touch-none cursor-grab rounded p-1 text-muted active:cursor-grabbing"
							isIconOnly
							size="sm"
							variant="ghost"
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
							variant="ghost"
							onClick={(event) => event.stopPropagation()}
							onPress={onToggle}
						>
							<ChevronRight
								className={["size-4 transition-transform", isExpanded && "rotate-90"].filter(Boolean).join(" ")}
							/>
						</Button>
					) : (
						<span aria-hidden="true" className="size-6 shrink-0" />
					)}
			</div>
			<div className="relative z-10 flex min-w-0 flex-1 items-center">
				{children}
			</div>
		</div>
	);
}

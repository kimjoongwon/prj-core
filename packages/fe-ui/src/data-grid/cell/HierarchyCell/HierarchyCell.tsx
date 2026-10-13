"use client";

import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../../../input/Button/Button";
import { useHandlers } from "./useHandlers";

export interface HierarchyCellProps {
	children: ReactNode;
	depth: number;
	rowLabel: string;
	canExpand: boolean;
	isExpanded: boolean;
	onToggle: () => void;
}

/** 계층 행의 이동 핸들, 들여쓰기, 펼침 버튼과 실제 셀 내용을 조합합니다. */
export function HierarchyCell(state: HierarchyCellProps) {
	const { children, depth, rowLabel, canExpand, isExpanded } = state;
	const railWidth = depth * 18 + 24;
	const handlers = useHandlers(state);

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
				{canExpand ? (
					<Button
						aria-expanded={isExpanded}
						aria-label={`${rowLabel} 하위 행 ${isExpanded ? "접기" : "펼치기"}`}
						className="size-6 min-w-6 rounded p-1 text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
						isIconOnly
						size="sm"
						variant="ghost"
						onClick={handlers.stopClickPropagation}
						onPress={handlers.toggleExpanded}
					>
						<ChevronRight
							className={[
								"size-4 transition-transform",
								isExpanded && "rotate-90",
							]
								.filter(Boolean)
								.join(" ")}
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

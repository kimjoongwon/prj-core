"use client";

import type { MouseEvent, PointerEvent } from "react";

const DATA_GRID_COLUMN_MIN_WIDTH = 64;
const DATA_GRID_COLUMN_MAX_WIDTH = 720;

export interface DataGridColumnResizerProps {
	columnId: string;
	maxSize?: number;
	minSize?: number;
	onColumnSizingChange: (columnId: string, size: number | null) => void;
}

function clampColumnWidth(width: number, minSize: number, maxSize: number) {
	return Math.min(Math.max(width, minSize), maxSize);
}

function getClientX(event: {
	clientX?: number;
	pageX?: number;
	screenX?: number;
}) {
	if (typeof event.clientX === "number" && Number.isFinite(event.clientX)) {
		return event.clientX;
	}
	if (typeof event.pageX === "number" && Number.isFinite(event.pageX)) {
		return event.pageX;
	}
	if (typeof event.screenX === "number" && Number.isFinite(event.screenX)) {
		return event.screenX;
	}
	return 0;
}

export function DataGridColumnResizerView({
	columnId,
	maxSize = DATA_GRID_COLUMN_MAX_WIDTH,
	minSize = DATA_GRID_COLUMN_MIN_WIDTH,
	onColumnSizingChange,
}: DataGridColumnResizerProps) {
	const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
		const headerCell = event.currentTarget.closest("th");
		if (!(headerCell instanceof HTMLElement)) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		const startX = getClientX(event);
		const startWidth = headerCell.getBoundingClientRect().width;

		const handlePointerMove = (moveEvent: globalThis.PointerEvent) => {
			const nextWidth = clampColumnWidth(
				startWidth + getClientX(moveEvent) - startX,
				minSize,
				maxSize,
			);
			onColumnSizingChange(columnId, Math.round(nextWidth));
		};

		const handlePointerUp = () => {
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
			window.removeEventListener("pointermove", handlePointerMove);
			window.removeEventListener("pointerup", handlePointerUp);
		};

		document.body.style.cursor = "col-resize";
		document.body.style.userSelect = "none";
		window.addEventListener("pointermove", handlePointerMove);
		window.addEventListener("pointerup", handlePointerUp, { once: true });
	};

	const handleDoubleClick = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		event.stopPropagation();
		onColumnSizingChange(columnId, null);
	};

	return (
		<button
			type="button"
			aria-label={`${columnId} 컬럼 너비 조절`}
			className="absolute right-0 top-0 z-10 h-full w-1 cursor-col-resize touch-none appearance-none border-0 bg-transparent p-0 transition-colors hover:bg-[#60a5fa] active:bg-[#2563eb] dark:hover:bg-sky-400 dark:active:bg-sky-500"
			data-testid={`data-grid-column-resizer-${columnId}`}
			onPointerDown={handlePointerDown}
			onDoubleClick={handleDoubleClick}
		/>
	);
}

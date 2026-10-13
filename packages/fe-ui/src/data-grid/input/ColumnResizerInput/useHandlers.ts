import type { MouseEvent, PointerEvent } from "react";
import type { ColumnResizerInputProps } from "./ColumnResizerInput";

const DATA_GRID_COLUMN_MIN_WIDTH = 64;
const DATA_GRID_COLUMN_MAX_WIDTH = 720;

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

export function useHandlers(state: ColumnResizerInputProps) {
	const {
		columnId,
		maxSize = DATA_GRID_COLUMN_MAX_WIDTH,
		minSize = DATA_GRID_COLUMN_MIN_WIDTH,
		onColumnSizingChange,
	} = state;

	return {
		resizeColumn(event: PointerEvent<HTMLButtonElement>) {
			const headerCell = event.currentTarget.closest("th");
			if (!(headerCell instanceof HTMLElement)) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();

			const startX = getClientX(event);
			const startWidth = headerCell.getBoundingClientRect().width;

			const resizeColumnOnMove = (moveEvent: globalThis.PointerEvent) => {
				const nextWidth = clampColumnWidth(
					startWidth + getClientX(moveEvent) - startX,
					minSize,
					maxSize,
				);
				onColumnSizingChange(columnId, Math.round(nextWidth));
			};

			const stopColumnResize = () => {
				document.body.style.cursor = "";
				document.body.style.userSelect = "";
				window.removeEventListener("pointermove", resizeColumnOnMove);
				window.removeEventListener("pointerup", stopColumnResize);
			};

			document.body.style.cursor = "col-resize";
			document.body.style.userSelect = "none";
			window.addEventListener("pointermove", resizeColumnOnMove);
			window.addEventListener("pointerup", stopColumnResize, { once: true });
		},
		resetColumnWidth(event: MouseEvent<HTMLButtonElement>) {
			event.preventDefault();
			event.stopPropagation();
			onColumnSizingChange(columnId, null);
		},
	};
}

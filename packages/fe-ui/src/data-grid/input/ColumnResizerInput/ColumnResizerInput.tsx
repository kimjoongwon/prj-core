"use client";

import { useHandlers } from "./useHandlers";

export interface ColumnResizerInputProps {
	columnId: string;
	maxSize?: number;
	minSize?: number;
	onColumnSizingChange: (columnId: string, size: number | null) => void;
}

export function ColumnResizerInput(state: ColumnResizerInputProps) {
	const { columnId } = state;
	const handlers = useHandlers(state);

	return (
		<button
			type="button"
			aria-label={`${columnId} 컬럼 너비 조절`}
			className="absolute right-0 top-0 z-10 h-full w-1 cursor-col-resize touch-none appearance-none border-0 bg-transparent p-0 transition-colors hover:bg-accent/60 active:bg-accent"
			data-testid={`data-grid-column-resizer-${columnId}`}
			onPointerDown={handlers.resizeColumn}
			onDoubleClick={handlers.resetColumnWidth}
		/>
	);
}

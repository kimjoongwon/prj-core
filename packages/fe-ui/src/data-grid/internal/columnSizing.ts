import type { ColumnDef } from "@tanstack/react-table";

export function getColumnWidthStyle<T extends object>(
	column: ColumnDef<T, unknown>,
) {
	const size = column.size;
	if (typeof size !== "number" || !Number.isFinite(size)) {
		return undefined;
	}

	return {
		width: size,
		minWidth: size,
	};
}

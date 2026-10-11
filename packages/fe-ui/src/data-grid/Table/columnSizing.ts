export function getColumnWidthStyle(size: number) {
	if (typeof size !== "number" || !Number.isFinite(size)) {
		return undefined;
	}

	return {
		width: size,
		minWidth: size,
	};
}

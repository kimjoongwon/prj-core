import { CellContext } from "@tanstack/react-table";

export const NumberCell = <T,>(cellContext: CellContext<T, unknown>) => {
	const { getValue } = cellContext;
	const value = getValue();

	if (value === null || value === undefined) {
		return <p>-</p>;
	}

	const numValue = Number(value);
	if (Number.isNaN(numValue)) {
		return <p>-</p>;
	}

	return <p>{numValue.toLocaleString()}</p>;
};

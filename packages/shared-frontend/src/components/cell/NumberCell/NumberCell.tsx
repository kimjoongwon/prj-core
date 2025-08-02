interface NumberCellProps {
	value: number | string | null | undefined;
}

export const NumberCell = ({ value }: NumberCellProps) => {
	if (value === null || value === undefined) {
		return <p>-</p>;
	}

	const numValue = Number(value);
	if (Number.isNaN(numValue)) {
		return <p>-</p>;
	}

	return <p>{numValue.toLocaleString()}</p>;
};

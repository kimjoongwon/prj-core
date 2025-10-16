interface DefaultCellProps {
	value: string | number;
}

export const DefaultCell = ({ value }: DefaultCellProps) => {
	if (!value && value !== 0) {
		return <p>-</p>;
	}

	return <p>{String(value)}</p>;
};

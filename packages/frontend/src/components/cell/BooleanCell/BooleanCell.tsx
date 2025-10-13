import { Chip } from "@heroui/react";

interface BooleanCellProps {
	value: boolean | null | undefined;
}

export const BooleanCell = ({ value }: BooleanCellProps) => {
	if (value === null || value === undefined) {
		return <p>-</p>;
	}

	const boolValue = Boolean(value);

	return (
		<Chip color={boolValue ? "success" : "default"} size="sm" variant="flat">
			{boolValue ? "예" : "아니오"}
		</Chip>
	);
};

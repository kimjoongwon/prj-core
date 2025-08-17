import { formatDateTime } from "@shared/utils";

interface DateTimeCellProps {
	value: string | Date | null | undefined;
}

export const DateTimeCell = ({ value }: DateTimeCellProps) => {
	if (!value) {
		return <p>-</p>;
	}

	return <p>{formatDateTime(value as string)}</p>;
};

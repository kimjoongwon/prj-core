import { formatDateTimeWithSeconds } from "@shared/utils";

interface DateCellProps {
	value: string | Date | null | undefined;
}

export const DateCell = ({ value }: DateCellProps) => {
	if (!value) {
		return <p>-</p>;
	}

	return <p>{formatDateTimeWithSeconds(value as string)}</p>;
};

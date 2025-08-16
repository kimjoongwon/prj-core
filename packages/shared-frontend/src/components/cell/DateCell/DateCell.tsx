import { DateTimeUtil } from "@shared/utils";

interface DateCellProps {
	value: string | Date | null | undefined;
}

export const DateCell = ({ value }: DateCellProps) => {
	if (!value) {
		return <p>-</p>;
	}

	return <p>{DateTimeUtil.formatDateTimeWithSeconds(value as string)}</p>;
};

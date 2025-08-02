import dayjs from "dayjs";

interface DateCellProps {
	value: string | Date | null | undefined;
}

export const DateCell = ({ value }: DateCellProps) => {
	if (!value) {
		return <p>-</p>;
	}

	return <p>{dayjs(value as string).format("YY.MM.DD HH:mm:ss")}</p>;
};

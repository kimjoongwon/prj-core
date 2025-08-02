import dayjs from "dayjs";

interface DateTimeCellProps {
	value: string | Date | null | undefined;
}

export const DateTimeCell = ({ value }: DateTimeCellProps) => {
	if (!value) {
		return <p>-</p>;
	}

	return <p>{dayjs(value as string).format("YYYY.MM.DD HH:mm")}</p>;
};

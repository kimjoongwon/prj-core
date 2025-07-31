import { Card, CardBody } from "@heroui/react";
import dayjs from "dayjs";
import { Text } from "../../../ui/Text";

export interface DateProps {
	value: string;
	selected?: boolean;
	isPressable?: boolean;
	className?: string;
	onDateClick?: (value: string) => void;
}

export const Date = (props: DateProps) => {
	const { value, selected = false, isPressable = true, className = "", onDateClick } = props;
	const date = dayjs(value).get("date");

	return (
		<Card
			isPressable={isPressable}
			shadow="sm"
			radius="sm"
			isHoverable
			onClick={() => onDateClick?.(value)}
			className={`${className}${selected ? " bg-primary-500 text-white" : ""} h-20`}
		>
			<CardBody className="text-right">
				<Text>{date}일</Text>
			</CardBody>
		</Card>
	);
};

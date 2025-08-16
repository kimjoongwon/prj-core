import { Chip } from "@heroui/chip";
import type { RecurringDayOfTheWeek } from "../../../types";
import { HStack, Text, VStack } from "../../ui";

export interface WeekInputProps {
	value?: RecurringDayOfTheWeek;
	onChange?: (value: RecurringDayOfTheWeek) => void;
	disabled?: boolean;
}

export const WeekInput = (props: WeekInputProps) => {
	const { value, onChange, disabled, ...rest } = props;

	const handleChange = (dayValue: RecurringDayOfTheWeek) => {
		onChange?.(dayValue);
	};

	const dayOptions: {
		text: string;
		value: RecurringDayOfTheWeek;
	}[] = [
		{
			text: "월",
			value: "MONDAY",
		},
		{
			text: "화",
			value: "TUESDAY",
		},
		{
			text: "수",
			value: "WEDNESDAY",
		},
		{
			text: "목",
			value: "THURSDAY",
		},
		{
			text: "금",
			value: "FRIDAY",
		},
		{
			text: "토",
			value: "SATURDAY",
		},
		{
			text: "일",
			value: "SUNDAY",
		},
	];

	return (
		<VStack className="space-y-2" {...rest}>
			<Text variant="caption">반복 요일</Text>
			<HStack className="space-x-2">
				{dayOptions.map((day) => {
					return (
						<Chip
							className="cursor-pointer"
							onClick={() => handleChange(day.value)}
							key={day.value}
							color={value === day.value ? "primary" : "default"}
							isDisabled={disabled}
						>
							{day.text}
						</Chip>
					);
				})}
			</HStack>
		</VStack>
	);
};

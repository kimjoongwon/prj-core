import { Chip } from "@heroui/chip";
import { get } from "lodash-es";
import { observer } from "mobx-react-lite";
import { useMobxHookForm } from "../../../hooks";
import type { RecurringDayOfTheWeek } from "../../../types";
import { HStack, Text, VStack } from "../../ui";

export interface WeekInputProps {
	state: any;
	path: string;
	disabled?: boolean;
}

export const WeekInput = observer((props: WeekInputProps) => {
	const { state, path, disabled, ...rest } = props;
	const initialValue = get(state, path);
	const { localState } = useMobxHookForm(initialValue, state, path);

	const handleChange = (value: RecurringDayOfTheWeek) => {
		localState.value = value;
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
							color={localState.value === day.value ? "primary" : "default"}
							isDisabled={disabled}
						>
							{day.text}
						</Chip>
					);
				})}
			</HStack>
		</VStack>
	);
});

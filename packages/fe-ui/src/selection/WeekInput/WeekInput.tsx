"use client";

import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";
import { useT } from "../../i18n";

export type RecurringDayOfTheWeek =
	| "MONDAY"
	| "TUESDAY"
	| "WEDNESDAY"
	| "THURSDAY"
	| "FRIDAY"
	| "SATURDAY"
	| "SUNDAY";

export interface WeekInputProps {
	value?: RecurringDayOfTheWeek;
	onChange?: (value: RecurringDayOfTheWeek) => void;
	disabled?: boolean;
}

export const WeekInput = observer(function WeekInput(props: WeekInputProps) {
	const t = useT();
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
		<div className="flex flex-col space-y-2" {...rest}>
			<span className="text-sm text-muted">{t("반복 요일")}</span>
			<div className="flex space-x-2">
				{dayOptions.map((day) => {
					return (
						<Chip
							className="cursor-pointer"
							onClick={() => handleChange(day.value)}
							key={day.value}
							color={value === day.value ? "primary" : "default"}
							isDisabled={disabled}
						>
							{t(day.text)}
						</Chip>
					);
				})}
			</div>
		</div>
	);
});

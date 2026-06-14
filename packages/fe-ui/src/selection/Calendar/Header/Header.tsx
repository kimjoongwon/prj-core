"use client";

import { observer } from "mobx-react-lite";
import { Button } from "../../../action/Button/Button";
import { useT } from "../../../i18n";

interface HeaderProps {
	year: number;
	month: number;
	onPrevMonth?: () => void;
	onNextMonth?: () => void;
}

export const Header = observer(function Header(props: HeaderProps) {
	const { year, month, onPrevMonth, onNextMonth } = props;

	return (
		<div className="flex justify-between">
			<div className="flex items-center justify-between">
				<Button
					size="sm"
					variant="light"
					onPress={onPrevMonth}
					startContent={<div>prev</div>}
				/>
				<div className="flex space-x-2">
					<Year year={year} />
					<Month month={month} />
				</div>
				<Button
					size="sm"
					variant="light"
					onPress={onNextMonth}
					endContent={<div>next</div>}
				/>
			</div>
		</div>
	);
});

interface YearProps {
	year: number;
}

export const Year = observer(function Year(props: YearProps) {
	const t = useT();
	const { year } = props;
	return (
		<div className="font-bold text-2xl lg:text-4xl">
			{t("{{year}}년", undefined, { year })}
		</div>
	);
});

interface MonthProps {
	month: number;
}

export const Month = observer(function Month(props: MonthProps) {
	const t = useT();
	const { month } = props;
	return (
		<div className="font-bold text-2xl lg:text-4xl">
			{t("{{month}}월", undefined, { month })}
		</div>
	);
});

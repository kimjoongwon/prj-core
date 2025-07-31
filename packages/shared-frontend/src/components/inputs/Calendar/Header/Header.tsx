import { Button, HStack } from "../../../../..";

interface HeaderProps {
	year: number;
	month: number;
	onPrevMonth?: () => void;
	onNextMonth?: () => void;
}

export const Header = (props: HeaderProps) => {
	const { year, month, onPrevMonth, onNextMonth } = props;

	return (
		<div className="flex justify-between">
			<HStack className="justify-between items-center">
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
			</HStack>
		</div>
	);
};

interface YearProps {
	year: number;
}

export const Year = (props: YearProps) => {
	const { year } = props;
	return <div className="text-2xl lg:text-4xl font-bold">{year}년</div>;
};

interface MonthProps {
	month: number;
}

export const Month = (props: MonthProps) => {
	const { month } = props;
	return <div className="text-2xl lg:text-4xl font-bold">{month}월</div>;
};

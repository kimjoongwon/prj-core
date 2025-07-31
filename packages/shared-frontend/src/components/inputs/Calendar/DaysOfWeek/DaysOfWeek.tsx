export const DaysOfWeek = () => {
	const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THR", "FRI", "SAT"];

	return (
		<>
			{daysOfWeek.map((dayOfWeek) => {
				return (
					<div
						key={dayOfWeek}
						className={`flex items-center justify-center text-sm font-medium ${
							["SAT", "SUN"].includes(dayOfWeek)
								? "text-red-500"
								: "text-gray-700"
						}`}
					>
						{dayOfWeek}
					</div>
				);
			})}
		</>
	);
};

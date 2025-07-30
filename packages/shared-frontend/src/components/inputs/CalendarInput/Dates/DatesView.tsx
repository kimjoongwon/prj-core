import { observer } from "mobx-react-lite";
import { useProps } from "../_hooks/useProps";
import { Date } from "../Date";

interface DatesViewProps {
	state: ReturnType<typeof useProps>["state"];
}

export const DatesView = observer((props: DatesViewProps) => {
	const { state } = props;

	return (
		<>
			{state.calendarInput.dates.map((date, idx) => (
				<Date key={date.id ?? idx} state={date} />
			))}
		</>
	);
});

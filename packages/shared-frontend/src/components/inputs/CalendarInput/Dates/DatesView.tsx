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
			{
				// @ts-ignore
				state.calendarInput.dates.map((date) => (
					<Date state={date} />
				))
			}
		</>
	);
});

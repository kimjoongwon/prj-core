import dayjs from "dayjs";
import { get } from "lodash-es";
import { observer } from "mobx-react-lite";
import { useFormField } from "@shared/hooks";
import type { MobxProps } from "../../../types";

interface TimePickerProps<T> extends MobxProps<T> {}

export const TimePicker = observer(
	<T extends object>(props: TimePickerProps<T>) => {
		const { path = "", state = {} } = props;

		const initialValue = get(state, path) || dayjs().format("HH:mm");

		const { localState } = useFormField({ initialValue, state, path });

		const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
			localState.value = event.target.value;
		};

		return (
			<input type="time" onChange={handleChange} value={localState.value} />
		);
	},
);

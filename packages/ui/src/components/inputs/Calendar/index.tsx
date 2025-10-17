import { useFormField } from "@cocrepo/hooks";
import { MobxProps } from "@cocrepo/types";
import { tools } from "@cocrepo/toolkit";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import {
  CalendarProps as BaseCalendarProps,
  Calendar as CalendarComponent,
} from "./Calendar";

export interface CalendarProps<T>
  extends MobxProps<T>,
    Omit<BaseCalendarProps, "value" | "onChange"> {}

export const Calendar = observer(
  <T extends object>(props: CalendarProps<T>) => {
    const { state, path, ...rest } = props;

    const initialValue = tools.get(state, path) || [];
    const { localState } = useFormField({ initialValue, state, path });

    const handleChange = action((value: string[]) => {
      localState.value = value;
    });

    return (
      <CalendarComponent
        {...rest}
        value={localState.value}
        onChange={handleChange}
      />
    );
  }
);

import { useFormField } from "@cocrepo/hooks";
import type { MobxProps } from "@cocrepo/types";
import { tools } from "@cocrepo/toolkit";
import { observer } from "mobx-react-lite";
import {
  WeekInput as BaseWeekInput,
  type WeekInputProps as BaseWeekInputProps,
  RecurringDayOfTheWeek,
} from "./WeekInput";

export interface WeekInputProps<T = any>
  extends MobxProps<T>,
    Omit<BaseWeekInputProps, "value" | "onChange"> {}

export const WeekInput = observer(
  <T extends object>(props: WeekInputProps<T>) => {
    const { state, path, ...rest } = props;

    const value = tools.get(state, path);
    const formField = useFormField({ value, state, path });

    const handleChange = (value: RecurringDayOfTheWeek) => {
      formField.setValue(value);
    };

    return (
      <BaseWeekInput
        {...rest}
        value={formField.state.value}
        onChange={handleChange}
      />
    );
  }
);

// Re-export types for backwards compatibility
export type { BaseWeekInputProps as PureWeekInputProps };

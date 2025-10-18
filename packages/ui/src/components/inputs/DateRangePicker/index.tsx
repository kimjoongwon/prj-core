import { parseAbsoluteToLocal } from "@internationalized/date";
import { useFormField } from "@cocrepo/hooks";
import { MobxProps } from "@cocrepo/types";
import { tools } from "@cocrepo/toolkit";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import {
  DateRangePickerProps as BaseDateRangePickerProps,
  DateRangePicker as DateRangePickerComponent,
} from "./DateRangePicker";

export interface DateRangePickerProps<T>
  extends MobxProps<T>,
    Omit<BaseDateRangePickerProps, "value" | "onChange"> {}

export const DateRangePicker = observer(
  <T extends object>(props: DateRangePickerProps<T>) => {
    const { state, path, ...rest } = props;

    const [startPath, endPath] = useMemo(
      () => (path as string)?.split(","),
      [path]
    );

    const startDateTime =
      tools.get(state, startPath) || new Date().toISOString();
    const endDateTime = tools.get(state, endPath) || new Date().toISOString();

    const initialValue = {
      start: parseAbsoluteToLocal(startDateTime),
      end: parseAbsoluteToLocal(endDateTime),
    };

    const { localState } = useFormField({
      initialValue,
      state,
      path,
    });

    const handleDateChange = action((value: any) => {
      if (value && startPath && endPath) {
        tools.set(state, startPath, value.start.toString());
        tools.set(state, endPath, value.end.toString());
      }
      localState.value = value;
    });

    return (
      <DateRangePickerComponent
        {...rest}
        value={localState.value}
        onChange={handleDateChange}
      />
    );
  }
);

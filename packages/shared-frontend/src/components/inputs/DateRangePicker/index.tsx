import type { DateRangePickerProps as HeroUiDateRangePickerProps } from "@heroui/react";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { get, set } from "lodash-es";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { useFormField } from "@shared/hooks";
import { MobxProps } from "../../../types";
import { DateRangePicker as DateRangePickerComponent, DateRangePickerProps as BaseDateRangePickerProps } from "./DateRangePicker";

export interface DateRangePickerProps<T>
  extends MobxProps<T>,
    Omit<BaseDateRangePickerProps<T>, "value" | "onChange" | "defaultValue"> {}

export const DateRangePicker = observer(<T extends object>(props: DateRangePickerProps<T>) => {
  const { state = {}, path = "", ...rest } = props;

  const [startPath, endPath] = useMemo(
    () => (path as string)?.split(","),
    [path],
  );

  const startDateTime = get(state, startPath) || new Date().toISOString();
  const endDateTime = get(state, endPath) || new Date().toISOString();

  const defaultValue = {
    start: parseAbsoluteToLocal(startDateTime),
    end: parseAbsoluteToLocal(endDateTime),
  };

  const { localState, setValue } = useFormField({ 
    initialValue: defaultValue, 
    state, 
    path 
  });

  const handleDateChange: HeroUiDateRangePickerProps["onChange"] = (
    value,
  ) => {
    if (value && startPath && endPath) {
      set(state, startPath, value.start.toString());
      set(state, endPath, value.end.toString());
    }
  };

  return (
    <DateRangePickerComponent
      {...rest}
      defaultValue={localState}
      onChange={handleDateChange}
    />
  );
});

export type { DateRangePickerProps };
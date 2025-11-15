import { parseAbsoluteToLocal } from "@internationalized/date";
import { useFormField } from "@cocrepo/hooks";
import { MobxProps } from "@cocrepo/types";
import { tools } from "@cocrepo/toolkit";
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

    const paths = useMemo(() => {
      const [start, end] = (path as string).split(",");
      return [start, end] as const;
    }, [path]);

    const startDateTime =
      tools.get(state, paths[0]) || new Date().toISOString();
    const endDateTime = tools.get(state, paths[1]) || new Date().toISOString();

    const initialValue = {
      start: parseAbsoluteToLocal(startDateTime),
      end: parseAbsoluteToLocal(endDateTime),
    };

    const formField = useFormField({
      value: initialValue,
      state,
      paths,
      pathMapper: (
        value: any,
        [startPath, endPath]: readonly [string, string]
      ) => ({
        [startPath]: value.start.toString(),
        [endPath]: value.end.toString(),
      }),
      pathCombiner: (
        values: Record<string, any>,
        [startPath, endPath]: readonly [string, string]
      ) => ({
        start: parseAbsoluteToLocal(values[startPath]),
        end: parseAbsoluteToLocal(values[endPath]),
      }),
    });

    const handleDateChange = (value: any) => {
      formField.setValue(value);
    };

    return (
      <DateRangePickerComponent
        {...rest}
        value={formField.state.value}
        onChange={handleDateChange}
      />
    );
  }
);

import { parseAbsoluteToLocal } from "@internationalized/date";
import { useFormField } from "@cocrepo/hooks";
import { MobxProps } from "@cocrepo/types";
import { tools } from "@cocrepo/toolkit";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import {
  DatePickerProps as BaseDatePickerProps,
  DatePicker as DatePickerComponent,
} from "./DatePicker";

export interface DatePickerProps<T>
  extends MobxProps<T>,
    Omit<BaseDatePickerProps, "value" | "onChange"> {}

export const DatePicker = observer(
  <T extends object>(props: DatePickerProps<T>) => {
    const { state, path, ...rest } = props;

    const defaultValue = tools.get(state, path) || new Date().toISOString();

    // Ensure defaultValue is a valid ISO string
    const isoString =
      typeof defaultValue === "string"
        ? defaultValue
        : new Date().toISOString();

    const defaultParsedValue = parseAbsoluteToLocal(isoString);

    const { localState } = useFormField<T, any>({
      initialValue: defaultParsedValue,
      state,
      path,
    });

    const handleDateChange = action((value: string) => {
      if (typeof value === "string") {
        try {
          const parsedValue = parseAbsoluteToLocal(value);
          localState.value = parsedValue;
        } catch (error) {
          console.error("Error parsing date value:", error);
        }
      }
    });

    return (
      <DatePickerComponent
        {...rest}
        value={localState.value}
        onChange={handleDateChange}
      />
    );
  }
);

import { useFormField } from "@cocrepo/hooks";
import { tools } from "@cocrepo/toolkit";
import { MobxProps } from "@cocrepo/types";
import { parseAbsoluteToLocal } from "@internationalized/date";
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

    const formField = useFormField<T, any>({
      value: defaultParsedValue,
      state,
      path,
    });

    const handleDateChange = (value: string) => {
      if (typeof value === "string") {
        try {
          const parsedValue = parseAbsoluteToLocal(value);
          formField.setValue(parsedValue);
        } catch (error) {
          console.error("Error parsing date value:", error);
        }
      }
    };

    return (
      <DatePickerComponent
        {...rest}
        value={formField.state.value}
        onChange={handleDateChange}
      />
    );
  }
);

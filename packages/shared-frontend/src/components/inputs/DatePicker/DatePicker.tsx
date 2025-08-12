import {
  DatePicker as HeroUiDatePicker,
  DatePickerProps as HeroUiDatePickerProps,
} from "@heroui/react";
import type {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
} from "@internationalized/date";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { get, set } from "lodash-es";
import { reaction } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import { MobxProps } from "../../../types";

interface DatePickerProps<T = any>
  extends HeroUiDatePickerProps,
    MobxProps<T> {}

const DatePickerComponent = <T extends object>(props: DatePickerProps<T>) => {
  const { state, path = "", ...rest } = props;
  const defaultValue = (get(state, path) || new Date().toISOString()) as string;

  const localState = useLocalObservable(() => ({
    value: parseAbsoluteToLocal(defaultValue),
  }));

  const handleDateChange = <T extends object>(
    value: CalendarDate | CalendarDateTime | ZonedDateTime | null,
    localState: { value: ZonedDateTime }
  ) => {
    if (value && "toAbsoluteString" in value) {
      localState.value = value as ZonedDateTime;
    }
  };

  useEffect(() => {
    const disposer = reaction(
      () => localState.value,
      () => {
        set(state, path, localState.value.toAbsoluteString());
      }
    );

    return disposer;
  });

  return (
    <HeroUiDatePicker
      {...rest}
      hideTimeZone
      value={localState.value}
      onChange={(value) => handleDateChange(value, localState)}
    />
  );
};

export const DatePicker = observer(DatePickerComponent);

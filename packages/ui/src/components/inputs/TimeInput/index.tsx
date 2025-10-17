import { useFormField } from "@cocrepo/hooks";
import { MobxProps } from "@cocrepo/types";
import { tools } from "@cocrepo/toolkit";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import {
  TimeInputProps as BaseTimeInputProps,
  TimeInput as TimeInputComponent,
} from "./TimeInput";

export interface TimeInputProps<T>
  extends MobxProps<T>,
    Omit<BaseTimeInputProps<T>, "value" | "onChange"> {}

export const TimeInput = observer(
  <T extends object>(props: TimeInputProps<T>) => {
    const { state, path, ...rest } = props;

    const initialValue = tools.get(state, path) || "";
    const { localState } = useFormField({ initialValue, state, path });

    const handleChange = action((value: string) => {
      localState.value = value;
    });

    return (
      <TimeInputComponent
        {...rest}
        value={localState.value}
        onChange={handleChange}
      />
    );
  }
);

import { useFormField } from "@cocrepo/hooks";
import { MobxProps } from "@cocrepo/types";
import { tools } from "@cocrepo/toolkit";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import {
  MultiSelectProps as BaseMultiSelectProps,
  MultiSelect as MultiSelectComponent,
} from "./MultiSelect";

export interface MultiSelectProps<T>
  extends MobxProps<T>,
    Omit<BaseMultiSelectProps<T>, "selectedKeys" | "onChange"> {}

export const MultiSelect = observer(
  <T extends object>(props: MultiSelectProps<T>) => {
    const { state, path, ...rest } = props;

    const initialValue = tools.get(state, path) || [];
    const { localState } = useFormField({ initialValue, state, path });

    const handleChange = action((e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value?.split(",") || [];
      localState.value = newValue;
    });

    return (
      <MultiSelectComponent
        {...rest}
        selectedKeys={new Set(localState.value)}
        onChange={handleChange}
      />
    );
  }
);

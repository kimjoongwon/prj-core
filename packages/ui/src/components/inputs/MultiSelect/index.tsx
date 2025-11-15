import { useFormField } from "@cocrepo/hooks";
import { MobxProps } from "@cocrepo/types";
import { tools } from "@cocrepo/toolkit";
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

    const value = tools.get(state, path) || [];
    const formField = useFormField({ value, state, path });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value?.split(",") || [];
      formField.setValue(newValue);
    };

    return (
      <MultiSelectComponent
        {...rest}
        selectedKeys={new Set(formField.state.value)}
        onChange={handleChange}
      />
    );
  }
);

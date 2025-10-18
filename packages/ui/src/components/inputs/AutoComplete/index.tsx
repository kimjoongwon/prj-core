import { useFormField } from "@cocrepo/hooks";
import { MobxProps } from "@cocrepo/types";
import { tools } from "@cocrepo/toolkit";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import {
  AutoComplete as BaseAutoComplete,
  type AutoCompleteProps as BaseAutoCompleteProps,
} from "./AutoComplete";

export interface AutoCompleteProps<T>
  extends MobxProps<T>,
    Omit<BaseAutoCompleteProps, "onSelectionChange"> {}

export const AutoComplete = observer(
  <T extends object>(props: AutoCompleteProps<T>) => {
    const { defaultItems = [], state, path, ...rest } = props;

    const initialValue = defaultItems
      ? [...defaultItems]?.find((item) => item.key === tools.get(state, path))
      : "";

    const { localState } = useFormField<any, any>({
      initialValue,
      state,
      path,
    });

    const handleSelectionChange: BaseAutoCompleteProps["onSelectionChange"] =
      action((value) => {
        localState.value = value;
      });

    return (
      <BaseAutoComplete
        {...rest}
        defaultItems={defaultItems}
        onSelectionChange={handleSelectionChange}
      />
    );
  }
);

// Re-export types for backwards compatibility
export type { BaseAutoCompleteProps as PureAutoCompleteProps };

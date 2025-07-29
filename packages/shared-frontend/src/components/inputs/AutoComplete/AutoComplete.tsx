import { Autocomplete, AutocompleteItem, AutocompleteProps } from "@heroui/react";
import { BaseAutoCompleteProps, Option } from "@shared/types";
import { get } from "lodash-es";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useMobxHookForm } from "../../../hooks";

export const AutoComplete = observer(<T extends object>(props: BaseAutoCompleteProps<T>) => {
  const { defaultItems = [], state = {}, path = "", label = "label", ...rest } = props;

  const initialValue = defaultItems
    ? [...defaultItems]?.find((item) => item.key === get(state, path))
    : "";

  const { localState } = useMobxHookForm(initialValue, state, path);

  const handleSelectionChange: AutocompleteProps["onSelectionChange"] = action((key) => {
    localState.value = key;
  });

  return (
    <Autocomplete
      {...rest}
      label={label}
      defaultItems={defaultItems}
      onSelectionChange={handleSelectionChange}
    >
      {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
    </Autocomplete>
  );
});

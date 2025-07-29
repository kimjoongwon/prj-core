import { InputProps } from "@heroui/react";
import { MultiInputProps } from "@shared/types";
import { get } from "lodash-es";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useInputState } from "../../../hooks/useInputState";
import { MultiInputView } from "./MultiInputView";

export const MultiInput = observer(<T extends object>(props: MultiInputProps<T>) => {
  const { path = "", state: _state } = props;
  const state = useInputState<{}, string[]>({
    defaultValue: get(_state, path) as string[],
    // @ts-ignore
    state: _state,
    path,
  });

  const localState = useLocalObservable(() => ({
    value: "",
  }));

  const handleOnKeyDown: InputProps["onKeyDown"] = (e) => {
    if (e.key === "Enter" && e.target) {
      state.value.push(localState.value);
    }
  };

  const onChange: InputProps["onChange"] = (e) => {
    localState.value = e.target.value;
  };

  return (
    <MultiInputView
      {...props}
      onKeyDown={handleOnKeyDown}
      onChange={onChange}
      value={localState.value}
    />
  );
});

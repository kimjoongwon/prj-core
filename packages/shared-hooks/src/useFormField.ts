import type { MobxProps } from "@cocrepo/types";
import { tools } from "@cocrepo/utils";
import { reaction } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

export interface UseFormFieldOptions<TState = any, TValue = any>
  extends Pick<MobxProps<TState>, "state" | "path"> {
  initialValue: TValue;
}

export const useFormField = <TState = any, TValue = any>({
  initialValue,
  state,
  path,
}: UseFormFieldOptions<TState, TValue>) => {
  const localState = useLocalObservable(() => ({
    value: initialValue as TValue,
  }));

  useEffect(() => {
    const setterDisposer = reaction(
      () => localState.value,
      (value) => {
        tools.set(state, path, value);
      }
    );

    const getterDisposer = reaction(
      () => tools.get(state, path),
      (value) => {
        localState.value = value as TValue;
      }
    );

    return () => {
      setterDisposer();
      getterDisposer();
    };
  }, [localState, state, path]);

  return {
    localState,
  };
};

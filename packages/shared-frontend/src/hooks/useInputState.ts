import { get, set } from "lodash-es";
import { reaction } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

interface InputState<S, V> {
  extendState?: S;
  defaultValue: V;
  state: S;
  path: any;
}

export const useInputState = <S extends object, V>({
  extendState,
  defaultValue,
  path,
  state,
}: InputState<S, V>) => {
  const inputState = useLocalObservable(() => ({
    ...extendState,
    value: get(state, path) || defaultValue,
  }));

  useEffect(() => {
    const setterDisposer = reaction(
      () => inputState.value,
      (value) => {
        set(state, path, value);
      },
    );

    const getterDisposer = reaction(
      () => get(state, path),
      (value) => {
        inputState.value = value;
      },
    );

    return () => {
      setterDisposer();
      getterDisposer();
    };
  }, [inputState, path, state]);

  return inputState;
};

'use client';

import { useEffect } from 'react';
import { useLocalObservable } from 'mobx-react-lite';
import { reaction } from 'mobx';
import { get, set } from 'lodash-es';

interface InputState<T> {
  extendState: T;
  state: object;
  path: any;
}

export const useInputState = <T extends object, V>({
  extendState,
  path,
  state,
}: InputState<T>) => {
  const inputState = useLocalObservable<T & { value: V }>(() => ({
    ...extendState,
    value: get(state, path),
  }));

  useEffect(() => {
    const setterDisposer = reaction(
      () => inputState.value,
      value => {
        set(state, path, value);
      },
    );

    const getterDisposer = reaction(
      () => get(state, path),
      value => {
        inputState.value = value;
      },
    );

    return () => {
      setterDisposer();
      getterDisposer();
    };
  }, []);

  return { ...state, ...inputState };
};

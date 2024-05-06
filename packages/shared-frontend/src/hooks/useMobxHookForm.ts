import { useEffect } from 'react';
import { useLocalObservable } from 'mobx-react-lite';
import { reaction } from 'mobx';
import { get, set } from 'lodash-es';

export const useMobxHookForm = (initialValue: any, state: any, path: any) => {
  const localState = useLocalObservable(() => ({
    value: initialValue,
  }));

  useEffect(() => {
    const setterDisposer = reaction(
      () => localState.value,
      value => {
        set(state, path, value);
      },
    );

    const getterDisposer = reaction(
      () => get(state, path),
      value => {
        localState.value = value;
      },
    );

    return () => {
      setterDisposer();
      getterDisposer();
    };
  }, []);

  return {
    localState,
  };
};

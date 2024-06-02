import { useEffect } from 'react';
import { useLocalObservable } from 'mobx-react-lite';
import { reaction } from 'mobx';
import { get, set } from 'lodash-es';

export const useMobxHookForm = (initialValue: any, state: any, path: any) => {
  console.log('useMobxHookForm', initialValue, state, path);
  const localState = useLocalObservable(() => ({
    value: initialValue,
  }));

  useEffect(() => {
    const setterDisposer = reaction(
      () => localState.value,
      value => {
        console.log('setter?', localState.value);
        set(state, path, value);
      },
    );

    const getterDisposer = reaction(
      () => eval(`state.${path}`),
      value => {
        console.log('getter?', value);
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

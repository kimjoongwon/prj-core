import { useEffect } from 'react';
import { getMobxValue, setMobxValue } from '@kimjwally/utils';
import { useLocalObservable } from 'mobx-react-lite';
import { reaction } from 'mobx';

export const useMobxHookForm = (initialValue: any, state: any, path: any) => {
  const localState = useLocalObservable(() => ({
    value: initialValue,
  }));

  useEffect(() => {
    const setterDisposer = reaction(
      () => localState.value,
      value => {
        setMobxValue(state, path, value);
      },
    );

    const getterDisposer = reaction(
      () => getMobxValue(state, path),
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

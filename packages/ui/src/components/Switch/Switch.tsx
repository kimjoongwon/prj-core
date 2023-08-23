import { useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { action, reaction } from 'mobx';
import { getMobxValue, setMobxValue } from '@kimjwally/utils';
import { MobxProps } from '../../types';
import {
  Switch as NextUISwitch,
  SwitchProps as NextUISwitchProps,
} from '@nextui-org/react';

export interface SwitchProps<T> extends NextUISwitchProps, MobxProps<T> {}

function _Switch<T extends object>(props: SwitchProps<T>) {
  const { path = '', state = {}, ...rest } = props;

  const localState = useLocalObservable(() => ({
    value: getMobxValue(state, path),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = action((isSelected: boolean) => {
    localState.value = isSelected;
  });

  return (
    <NextUISwitch {...rest} onValueChange={onChange} value={localState.value} />
  );
}

export const Switch = observer(_Switch);

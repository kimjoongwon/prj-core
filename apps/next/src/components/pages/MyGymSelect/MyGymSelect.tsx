'use client';

import { GymDto, Listbox } from '@shared/frontend';
import { MobxProps } from '@shared/types';
import { set } from 'lodash-es';
import { reaction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';

interface MyGymSelectProps<T> extends MobxProps<T> {
  gyms: GymDto[];
}

export const MyGymSelect = observer(
  <T extends object>(props: MyGymSelectProps<T>) => {
    const { state, path, gyms } = props;

    const myGymOptions = gyms.map(gym => ({
      text: gym.name,
      value: gym.id,
    }));

    const localState = useLocalObservable(() => ({
      selectedRowId: '',
    }));

    useEffect(() => {
      const disposer = reaction(
        () => localState.selectedRowId,
        () => {
          set(state, path, localState.selectedRowId);
        },
      );

      return disposer;
    }, []);

    return (
      <Listbox
        selectionMode="single"
        path={path}
        state={state}
        options={myGymOptions}
      />
    );
  },
);

'use client';

import { GroundDto, Listbox } from '@shared/frontend';
import { MobxProps } from '@shared/types';
import { set } from 'lodash-es';
import { reaction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect } from 'react';

interface MyGroundSelectProps<T> extends MobxProps<T> {
  grounds: GroundDto[];
}

export const MyGroundSelect = observer(
  <T extends object>(props: MyGroundSelectProps<T>) => {
    const { state, path, grounds } = props;

    const myGroundOptions = grounds.map(ground => ({
      text: ground.workspace?.name || '-',
      value: ground.id,
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
        options={myGroundOptions}
      />
    );
  },
);

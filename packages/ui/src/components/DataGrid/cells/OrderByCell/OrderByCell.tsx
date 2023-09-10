'use client';

import { HeaderCellProps } from '../@types';
import { useMobxHookForm } from '../../../../hooks';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';
import { get } from 'lodash-es';

interface OrderByCellProps<T, M> extends HeaderCellProps<T, M> {}

interface LocalState {
  value: 'asc' | 'desc';
}

function _OrderByCell<T extends object, M extends object>(
  props: OrderByCellProps<T, M>,
) {
  const {
    mobxProps: { path = '', state },
    headerContext,
  } = props;

  const initialValue = get(state, path);
  // const localState: LocalState = useLocalObservable(() => ({
  //   value: initialValue,
  // }));

  const { localState } = useMobxHookForm(initialValue, state, path);

  const onClickSort = action(() => {
    if (localState.value === 'asc') {
      return (localState.value = 'desc');
    }

    if (localState.value === 'desc') {
      return (localState.value = 'asc');
    }
  });

  return <div onClick={onClickSort}>{headerContext.header.id}</div>;
}

export const OrderByCell = observer(_OrderByCell);

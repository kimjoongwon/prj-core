import { observer } from 'mobx-react-lite';
import {
  Pagination as NextUIPagination,
  PaginationProps as NextUIPaginationProps,
} from '@nextui-org/react';
import { useMobxHookForm } from '../../../hooks';
import { MobxProps } from '../../../types';
import { get, set } from 'lodash-es';

interface PaginationProps<
  T extends {
    state: {
      take: number;
      skip: number;
    };
  },
> extends NextUIPaginationProps,
    MobxProps<T> {}

export function Pagination<T extends object>(props: PaginationProps<T>) {
  const {
    state = { take: 0, skip: 0 },
    path = '',
    total = 18,
    ...rest
  } = props;
  const initialValue = get(state, path);
  const { localState } = useMobxHookForm(initialValue, state, path);

  const onChangePage = (page: number) => {
    const offset = page - 1;
    localState.value = offset;
    set(state, path, offset * state.take);
  };

  const page = localState.value + 1;

  return (
    <NextUIPagination
      {...rest}
      onChange={onChangePage}
      page={page}
    />
  );
}

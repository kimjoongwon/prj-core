import { observer } from 'mobx-react-lite';
import {
  Pagination as NextUIPagination,
  PaginationProps as NextUIPaginationProps,
} from '@nextui-org/react';
import { useMobxHookForm } from '../../../hooks';
import { MobxProps } from '../../../types';
import { get, set } from 'lodash-es';
import { useState } from 'react';

interface PaginationProps<T>
  extends Omit<NextUIPaginationProps, 'total'>,
    MobxProps<T> {
  totalCount: number;
}

export function Pagination<T extends { table: { take: number; skip: number } }>(
  props: PaginationProps<T>,
) {
  const {
    state = {
      table: {
        take: 0,
        skip: 0,
      },
    },
    path = '',
    totalCount,
    ...rest
  } = props;
  const [currentPage, setCurrentPage] = useState(0);
  const initialValue = get(state, path);
  const { localState } = useMobxHookForm(initialValue, state, path);

  const onChangePage = (page: number) => {
    const offset = page - 1;

    localState.value = offset;

    setCurrentPage(page);

    set(state, path, offset * state.table.take);
  };

  return (
    <NextUIPagination
      {...rest}
      total={totalCount / state.table.take}
      onChange={onChangePage}
      page={currentPage}
    />
  );
}

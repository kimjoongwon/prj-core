'use client';

import {
  Pagination as NextUIPagination,
  PaginationProps as NextUIPaginationProps,
} from '@nextui-org/react';
import { useMobxHookForm } from '../../../hooks';
import { MobxProps } from '../../../model';
import { get, set } from 'lodash-es';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';

export interface PaginationProps<T>
  extends Omit<NextUIPaginationProps, 'total'>,
    MobxProps<T> {
  totalCount: number;
}

export const Pagination = <T extends { take: number; skip: number }>(
  props: PaginationProps<T>,
) => {
  const {
    state = {
      take: 0,
      skip: 0,
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

    set(state, path, offset * state.take);
  };

  const total = totalCount / state.take;

  return (
    <NextUIPagination
      {...rest}
      total={totalCount / state.take < 1 ? 1 : total}
      onChange={onChangePage}
      page={currentPage}
    />
  );
};

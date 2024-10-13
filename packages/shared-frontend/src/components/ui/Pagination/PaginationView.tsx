'use client';

import { Pagination, PaginationProps } from '@nextui-org/react';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { TableQuery } from '../DataGrid';

export interface PaginationViewProps extends Omit<PaginationProps, 'total'> {
  totalCount: number;
  state: TableQuery;
}

export const PaginationView = observer((props: PaginationViewProps) => {
  const {
    state = {
      take: 10,
      skip: 0,
    },
    totalCount = 1,
    ...rest
  } = props;

  const [currentPage, setCurrentPage] = useState(0);

  const onChangePage = (page: number) => {
    state.skip = (page - 1) * state.take;
    setCurrentPage(page);
  };

  const total = Math.ceil(totalCount / state.take);

  return (
    <Pagination
      {...rest}
      total={total}
      onChange={onChangePage}
      page={currentPage}
    />
  );
});

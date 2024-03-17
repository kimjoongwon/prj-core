'use client';

import { Skeleton } from '@coc/web';
import {
  ButtonGroupContainer,
  DataGridContainer,
  PaginationContainer,
  SearchFilterContainer,
} from '../../containers';

export const DashboardSkeleton = () => {
  return (
    <>
      <Skeleton>
        <SearchFilterContainer />
      </Skeleton>
      <Skeleton>
        <ButtonGroupContainer />
      </Skeleton>
      <Skeleton>
        <DataGridContainer />
      </Skeleton>
      <Skeleton>
        <PaginationContainer />
      </Skeleton>
    </>
  );
};

'use client';

import { Skeleton } from '@coc/ui';
import {
  ButtonGroupContainer,
  DataGridContainer,
  PaginationContainer,
  SearchFilterContainer,
} from '@containers';

export const UsersSkeleton = () => {
  return (
    <>
      <Skeleton>
        <SearchFilterContainer children={undefined} />
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

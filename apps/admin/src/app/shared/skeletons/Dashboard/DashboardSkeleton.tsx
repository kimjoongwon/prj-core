import { Skeleton } from '@coc/ui';
import {
  ButtonGroupContainer,
  DataGridContainer,
  PaginationContainer,
  SearchFilterContainer,
} from '@containers';

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

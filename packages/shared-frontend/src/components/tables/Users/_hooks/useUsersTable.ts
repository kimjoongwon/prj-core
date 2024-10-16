import { UsersTableProps } from '..';
import { useColumns } from './useColumns';
import { useHandlers } from './useHandlers';
import { useLeftButtons } from './useLeftButtons';
import { useQueries } from './useQueries';

export const useUsersTables = (props: UsersTableProps) => {
  const columns = useColumns();
  const handlers = useHandlers({ props });
  const leftButtons = useLeftButtons({ handlers });
  const queries = useQueries({ props });

  return {
    queries,
    leftButtons,
    columns,
  };
};

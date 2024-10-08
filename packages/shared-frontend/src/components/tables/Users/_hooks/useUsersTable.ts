import { UsersTableProps } from '..';
import { useColumns } from './useColumns';
import { useHandlers } from './useHandlers';
import { useLeftButtons } from './useLeftButtons';

export const useUsersTables = (props: UsersTableProps) => {
  const columns = useColumns();
  const handlers = useHandlers({ props });
  const leftButtons = useLeftButtons({ handlers });

  return {
    leftButtons,
    columns,
  };
};

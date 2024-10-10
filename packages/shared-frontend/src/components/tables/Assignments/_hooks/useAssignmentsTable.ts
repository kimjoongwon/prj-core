import { AssignmentsTableProps } from '..';
import { useColumns } from './useColumns';
import { useHandlers } from './useHandlers';
import { useLeftButtons } from './useLeftButtons';
import { useMutations } from './useMutations';
import { useRightButtons } from './useRightButtons';

export const useAssignmentsTables = (props: AssignmentsTableProps) => {
  const columns = useColumns();
  const mutations = useMutations();
  const handlers = useHandlers({ props, mutations });
  const rightButtons = useRightButtons({ handlers });
  const leftButtons = useLeftButtons({ handlers });

  return {
    rightButtons,
    leftButtons,
    columns,
  };
};

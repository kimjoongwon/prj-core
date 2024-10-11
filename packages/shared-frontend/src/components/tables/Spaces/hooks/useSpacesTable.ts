import { ButtonProps } from '@nextui-org/react';
import { useColumns } from './useColumns';
import { useState } from './useState';
import { useHandlers } from './useHandlers';
import { useContext } from './useContext';
import { useMutations } from './useMutations';
import { useLeftButtons } from './useLeftButtons';
import { useRightButtons } from './useRightButtons';
import { SpacesTableProps } from '..';

export const useSpacesTable = (props?: SpacesTableProps) => {
  const state = useState({ props });
  const context = useContext();
  const data = useMutations();
  const handlers = useHandlers({
    state,
    context,
    data,
  });
  const leftButtons = useLeftButtons({ props, handlers });
  const rightButtons = useRightButtons({ props, handlers });
  const columns = useColumns();

  return {
    leftButtons,
    rightButtons,
    state,
    columns,
  };
};

import { CategoriesTableProps } from '..';
import { useColumns } from './useColumns';
import { useHandlers } from './useHandlers';
import { useLeftButtons } from './useLeftButtons';
import { useRightButtons } from './useRightButtons';
import { useState } from './useState';

export const useCategoriesTable = (context: {
  props?: CategoriesTableProps;
}) => {
  const { props } = context;
  const state = useState({
    props,
  });
  const handlers = useHandlers({
    state,
  });
  const leftButtons = useLeftButtons({
    handlers,
    props,
  });
  const rightButtons = useRightButtons();
  const columns = useColumns();

  return {
    state,
    handlers,
    leftButtons,
    rightButtons,
    columns,
  };
};

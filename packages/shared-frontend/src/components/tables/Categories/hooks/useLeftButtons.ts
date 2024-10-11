import { ButtonProps } from '@nextui-org/react';
import { useHandlers } from './useHandlers';
import { CategoriesTableProps } from '..';

export const useLeftButtons = (context: {
  handlers: ReturnType<typeof useHandlers>;
  props?: CategoriesTableProps;
}) => {
  const {
    handlers: { onClickCreate },
    props,
  } = context;

  const leftButtons: ButtonProps[] = [
    {
      children: '생성',
      color: 'primary',
      onClick: onClickCreate,
    },
  ];
  return leftButtons.concat(props?.leftButtons || []);
};

import { ButtonProps } from '@nextui-org/react';
import { useHandlers } from './useHandlers';

export const useRightButtons = (context: {
  handlers: ReturnType<typeof useHandlers>;
}) => {
  const {
    handlers: { onClickDelete },
  } = context;

  const rightButtons: ButtonProps[] = [
    {
      children: '삭제',
      color: 'danger',
      onClick: onClickDelete,
    },
  ];

  return rightButtons;
};

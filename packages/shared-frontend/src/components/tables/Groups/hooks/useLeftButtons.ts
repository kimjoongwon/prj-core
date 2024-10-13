import { ButtonProps } from '@nextui-org/react';
import { useHandlers } from './useHandlers';

export const useLeftButtons = (context: {
  handlers: ReturnType<typeof useHandlers>;
}) => {
  const {
    handlers: { onClickCreate },
  } = context;

  const leftButtons: ButtonProps[] = [
    {
      children: '생성',
      onClick: onClickCreate,
      color: 'primary',
    },
  ];

  return leftButtons;
};

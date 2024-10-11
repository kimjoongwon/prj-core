import { ButtonProps } from '@nextui-org/react';

export const useRightButtons = () => {
  const rightButtons: ButtonProps[] = [
    {
      children: '삭제',
      color: 'danger',
      onClick: async () => alert('not implemented'),
    },
  ];

  return rightButtons;
};

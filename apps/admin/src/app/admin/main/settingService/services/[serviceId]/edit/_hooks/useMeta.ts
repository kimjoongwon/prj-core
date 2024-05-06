import { ButtonProps } from '@nextui-org/react';
import { router } from '@shared/frontend';
import { useHandlers } from './useHandlers';

export const useMeta = ({
  handlers: { onClickCancel, onClickSave },
}: {
  handlers: ReturnType<typeof useHandlers>;
}) => {
  const leftButtons: ButtonProps[] = [
    {
      children: '취소',
      onClick: () => {
        onClickCancel();
      },
    },
  ];

  const rightButtons: ButtonProps[] = [
    {
      children: '저장',
      color: 'primary',
      onClick: async () => {
        onClickSave();
      },
    },
  ];

  return {
    rightButtons,
    leftButtons,
  };
};

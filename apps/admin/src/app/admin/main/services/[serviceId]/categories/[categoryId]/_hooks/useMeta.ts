import { ButtonProps } from '@nextui-org/react';
import { useHandlers } from './useHandlers';

export const useMeta = ({
  handlers,
}: {
  handlers: ReturnType<typeof useHandlers>;
}) => {
  const { onClickDelete, onClickEdit } = handlers;

  const leftButtons: ButtonProps[] = [
    {
      onClick: onClickDelete,
      children: '삭제',
      color: 'danger',
    },
  ];

  const rightButtons: ButtonProps[] = [
    {
      children: '수정',
      onClick: onClickEdit,
    },
  ];

  return {
    leftButtons,
    rightButtons,
  };
};

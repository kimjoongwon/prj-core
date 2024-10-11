import { ButtonProps } from '@nextui-org/react';
import { SpacesTableProps } from '..';
import { useHandlers } from './useHandlers';

export const useRightButtons = (context: {
  props: SpacesTableProps;
  handlers: ReturnType<typeof useHandlers>;
}) => {
  const {
    props,
    handlers: { onClickRemove },
  } = context;

  const rightButtons: ButtonProps[] = [
    {
      children: '삭제',
      color: 'danger',
      onClick: onClickRemove,
    },
  ];

  return rightButtons.concat(props.rightButtons || []);
};

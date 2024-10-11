import { ButtonProps } from '@nextui-org/react';
import { SpacesTableProps } from '..';
import { useHandlers } from './useHandlers';

export const useLeftButtons = (context: {
  props: SpacesTableProps;
  handlers: ReturnType<typeof useHandlers>;
}) => {
  const {
    props,
    handlers: { onClickCreate },
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

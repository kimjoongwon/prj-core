import { Chip as NextUIChip, ChipProps } from '@nextui-org/react';

export function Chip(props: ChipProps) {
  const { children } = props;
  return <NextUIChip {...props}>{children}</NextUIChip>;
}

import { Chip as NextUIChip, ChipProps } from "@heroui/react";

export function Chip(props: ChipProps) {
  const { children } = props;
  return <NextUIChip {...props}>{children}</NextUIChip>;
}

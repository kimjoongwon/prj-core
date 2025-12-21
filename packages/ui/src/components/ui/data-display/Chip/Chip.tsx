import { ChipProps, Chip as NextUIChip } from "@heroui/react";

export function Chip(props: ChipProps) {
	const { children } = props;
	return <NextUIChip {...props}>{children}</NextUIChip>;
}

import { ButtonProps, Button as NextUIButton } from "@heroui/react";

export const Button = (props: ButtonProps) => {
	const { children, onPress, ...rest } = props;

	return (
		<NextUIButton onPress={onPress} {...rest}>
			{children}
		</NextUIButton>
	);
};

import { Button } from "../Button/Button";
import type { ButtonGroupItem } from "./ButtonGroupItem.props";

export const renderButtonGroupButton = (button: ButtonGroupItem) => {
	const { children, id, ...buttonProps } = button;

	return (
		<Button key={id} {...buttonProps}>
			{children}
		</Button>
	);
};

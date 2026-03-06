import type { ButtonProps, LinkProps } from "@heroui/react";
import { Link } from "@heroui/react";

export interface GroupButton extends ButtonProps {
	href?: LinkProps["href"];
}

export interface ButtonGroupProps {
	leftButtons?: GroupButton[];
	rightButtons?: GroupButton[];
}

import { v4 } from "uuid";
import { Button } from "../Button/Button";

export const ButtonGroup = (props: ButtonGroupProps) => {
	const { leftButtons, rightButtons } = props;
	const renderButton = (props: GroupButton) => {
		const { children, href } = props;

		if (href) {
			return (
				<Link key={v4()} href={href}>
					<Button color="primary" {...props}>
						{children}
					</Button>
				</Link>
			);
		}

		return (
			<Button key={v4()} {...props} size="sm">
				{children}
			</Button>
		);
	};

	return (
		<div className="flex flex-1 justify-between">
			<div>{leftButtons?.map(renderButton)}</div>
			<div>{rightButtons?.map(renderButton)}</div>
		</div>
	);
};

"use client";

import { ButtonGroup as HeroButtonGroup, cn } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ButtonGroupProps } from "./ButtonGroup.props";
import { renderButtonGroupButton } from "./button-group-button.render";

export const ButtonGroup = observer((props: ButtonGroupProps) => {
	const {
		id,
		leftButtons = [],
		rightButtons = [],
		...buttonGroupProps
	} = props;
	const hasLeftButtons = leftButtons.length > 0;
	const hasRightButtons = rightButtons.length > 0;
	const baseAriaLabel =
		typeof buttonGroupProps["aria-label"] === "string"
			? buttonGroupProps["aria-label"]
			: "Button group";

	if (!hasLeftButtons && !hasRightButtons) {
		return null;
	}

	return (
		<div
			className={cn(
				"flex w-full flex-1 items-center gap-3",
				hasLeftButtons && hasRightButtons && "justify-between",
				hasLeftButtons && !hasRightButtons && "justify-start",
				!hasLeftButtons && hasRightButtons && "justify-end",
			)}
		>
			{hasLeftButtons ? (
				<HeroButtonGroup
					{...buttonGroupProps}
					id={hasRightButtons && id ? `${id}-left` : id}
					aria-label={
						hasRightButtons ? `${baseAriaLabel} left` : baseAriaLabel
					}
				>
					{leftButtons.map(renderButtonGroupButton)}
				</HeroButtonGroup>
			) : null}
			{hasRightButtons ? (
				<HeroButtonGroup
					{...buttonGroupProps}
					id={hasLeftButtons && id ? `${id}-right` : id}
					aria-label={
						hasLeftButtons ? `${baseAriaLabel} right` : baseAriaLabel
					}
				>
					{rightButtons.map(renderButtonGroupButton)}
				</HeroButtonGroup>
			) : null}
		</div>
	);
});

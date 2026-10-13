"use client";

import { AlertDialog } from "@heroui/react";
import type { ReactNode } from "react";
import { Button } from "../../../input/Button/Button";
import {
	ActionButtonCell,
	type ActionButtonCellProps,
} from "../ActionButtonCell";
import { useHandlers } from "./useHandlers";

export interface ConfirmActionCellProps {
	title: string;
	description: string;
	confirmLabel?: string;
	triggerLabel?: ReactNode;
	status?: "accent" | "success" | "warning" | "danger";
	/** trigger 버튼의 HeroUI v3 Button variant */
	triggerVariant?: ActionButtonCellProps["variant"];
	startContent?: ReactNode;
	isDisabled?: boolean;
	className?: string;
	tooltip?: string;
	onConfirm: () => void | Promise<void>;
}

/** 확인 후 실행해야 하는 row action을 일관된 AlertDialog로 표시합니다. */
export function ConfirmActionCell(state: ConfirmActionCellProps) {
	const {
		title,
		description,
		confirmLabel = "삭제",
		triggerLabel = "삭제",
		status = "danger",
		triggerVariant = "danger-soft",
		startContent,
		isDisabled,
		className,
		tooltip,
		onConfirm,
	} = state;
	const handlers = useHandlers(state);
	const triggerButtonProps: ActionButtonCellProps = {
		variant: triggerVariant,
		isDisabled,
		className,
		"aria-label": tooltip,
	};
	const trigger = (
		<ActionButtonCell {...triggerButtonProps}>
			{startContent}
			{triggerLabel}
		</ActionButtonCell>
	);

	if (isDisabled) {
		return trigger;
	}

	return (
		<AlertDialog>
			<AlertDialog.Trigger>{trigger}</AlertDialog.Trigger>
			<AlertDialog.Backdrop>
				<AlertDialog.Container size="sm">
					<AlertDialog.Dialog>
						<AlertDialog.Header>
							<AlertDialog.Icon status={status} />
							<AlertDialog.Heading>{title}</AlertDialog.Heading>
						</AlertDialog.Header>
						<AlertDialog.Body>{description}</AlertDialog.Body>
						<AlertDialog.Footer>
							<Button variant="ghost">취소</Button>
							<Button
								variant={handlers.getConfirmButtonVariant()}
								onPress={onConfirm}
							>
								{confirmLabel}
							</Button>
						</AlertDialog.Footer>
					</AlertDialog.Dialog>
				</AlertDialog.Container>
			</AlertDialog.Backdrop>
		</AlertDialog>
	);
}

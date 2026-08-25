"use client";

import { AlertDialog } from "@heroui/react";
import type { ReactNode } from "react";
import { Button } from "../../../input/Button/Button";
import {
	ActionButtonCell,
	type ActionButtonCellProps,
} from "../ActionButtonCell";

export interface ConfirmActionCellProps {
	title: string;
	description: string;
	confirmLabel?: string;
	triggerLabel?: ReactNode;
	status?: "accent" | "success" | "warning" | "danger";
	triggerColor?: "default" | "primary" | "success" | "warning" | "danger";
	triggerVariant?: "flat" | "light" | "bordered" | "solid";
	startContent?: ReactNode;
	isDisabled?: boolean;
	className?: string;
	tooltip?: string;
	onConfirm: () => void | Promise<void>;
}

function getTriggerButtonVariant({
	triggerColor,
	triggerVariant,
}: Pick<ConfirmActionCellProps, "triggerColor" | "triggerVariant">) {
	if (triggerColor === "danger") return "danger-soft";
	if (triggerVariant === "solid") return "primary";
	if (triggerVariant === "bordered") return "outline";
	return "ghost";
}

/** 확인 후 실행해야 하는 row action을 일관된 AlertDialog로 표시합니다. */
export function ConfirmActionCell({
	title,
	description,
	confirmLabel = "삭제",
	triggerLabel = "삭제",
	status = "danger",
	triggerColor = "danger",
	triggerVariant = "flat",
	startContent,
	isDisabled,
	className,
	tooltip,
	onConfirm,
}: ConfirmActionCellProps) {
	const triggerButtonProps: ActionButtonCellProps = {
		variant: getTriggerButtonVariant({ triggerColor, triggerVariant }),
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
								variant={triggerColor === "danger" ? "danger" : "primary"}
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

"use client";

import {
	AlertDialog as HeroAlertDialog,
	type AlertDialogProps as HeroAlertDialogProps,
} from "@heroui/react";
import { observer } from "mobx-react-lite";

const AlertDialogBase = (props: HeroAlertDialogProps) => {
	return <HeroAlertDialog {...props} />;
};

export const AlertDialog = Object.assign(
	observer(AlertDialogBase),
	HeroAlertDialog,
) as unknown as typeof HeroAlertDialog;

export type { HeroAlertDialogProps as AlertDialogProps };

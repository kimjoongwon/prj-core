"use client";

import { Toast as HeroToast } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type ToastProps = ComponentProps<typeof HeroToast>;

const ToastBase = (props: ToastProps) => {
	return <HeroToast {...props} />;
};

export const Toast = Object.assign(
	observer(ToastBase),
	HeroToast,
) as unknown as typeof HeroToast;

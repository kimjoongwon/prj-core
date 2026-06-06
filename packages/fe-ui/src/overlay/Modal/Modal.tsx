"use client";

import {
	Modal as HeroModal,
	type ModalProps as HeroModalProps,
} from "@heroui/react";
import { observer } from "mobx-react-lite";

const ModalBase = (props: HeroModalProps) => {
	return <HeroModal {...props} />;
};

export const Modal = Object.assign(
	observer(ModalBase),
	HeroModal,
) as unknown as typeof HeroModal;

export type { HeroModalProps as ModalProps };

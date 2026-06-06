"use client";

import { FieldError as HeroFieldError } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type FieldErrorProps = ComponentProps<typeof HeroFieldError>;

const FieldErrorBase = (props: FieldErrorProps) => {
	return <HeroFieldError {...props} />;
};

export const FieldError = Object.assign(
	observer(FieldErrorBase),
	HeroFieldError,
) as unknown as typeof HeroFieldError;

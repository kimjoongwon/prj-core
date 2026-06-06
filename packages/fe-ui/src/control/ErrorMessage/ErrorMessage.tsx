"use client";

import { ErrorMessage as HeroErrorMessage } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type ErrorMessageProps = ComponentProps<typeof HeroErrorMessage>;

const ErrorMessageBase = (props: ErrorMessageProps) => {
	return <HeroErrorMessage {...props} />;
};

export const ErrorMessage = Object.assign(
	observer(ErrorMessageBase),
	HeroErrorMessage,
) as unknown as typeof HeroErrorMessage;

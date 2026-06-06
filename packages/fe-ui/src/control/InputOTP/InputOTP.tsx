"use client";

import { InputOTP as HeroInputOTP } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type InputOTPProps = ComponentProps<typeof HeroInputOTP>;

const InputOTPBase = (props: InputOTPProps) => {
	return <HeroInputOTP {...props} />;
};

export const InputOTP = Object.assign(
	observer(InputOTPBase),
	HeroInputOTP,
) as unknown as typeof HeroInputOTP;

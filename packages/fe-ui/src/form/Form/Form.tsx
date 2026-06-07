"use client";

import { Form as HeroForm } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type FormProps = ComponentProps<typeof HeroForm>;

const FormBase = (props: FormProps) => {
	return <HeroForm {...props} />;
};

export const Form = Object.assign(
	observer(FormBase),
	HeroForm,
) as unknown as typeof HeroForm;

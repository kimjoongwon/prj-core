"use client";

import type { SchemaClass } from "@cocrepo/schema";
import type { FormSchemaStateContract, FormStateContract } from "@cocrepo/type";
import { Form as HeroForm } from "@heroui/react";
import type { ComponentProps, FormEventHandler, ReactNode } from "react";
import {
	FormValidationProvider,
	type FormValidationTiming,
	useFormValidationContext,
} from "./FormValidationContext";

type HeroFormProps = ComponentProps<typeof HeroForm>;

export interface FormProps<TState extends object, TSchema extends object>
	extends Omit<HeroFormProps, "children" | "validationErrors"> {
	children: ReactNode;
	state: TState & FormSchemaStateContract<TSchema>;
	schema?: SchemaClass<TSchema>;
	readOnly?: boolean;
	validationTimings?: FormValidationTiming[];
	onSubmitCapture?: FormEventHandler<HTMLFormElement>;
}

interface FormRootProps extends Omit<HeroFormProps, "children"> {
	children: ReactNode;
	onSubmitCapture?: FormEventHandler<HTMLFormElement>;
}

function FormRoot({ children, onSubmitCapture, ...props }: FormRootProps) {
	const validation = useFormValidationContext();

	const handleSubmitCapture: FormEventHandler<HTMLFormElement> = (event) => {
		if (validation && !validation.validateAll()) {
			event.preventDefault();
			event.stopPropagation();
			return;
		}

		onSubmitCapture?.(event);
	};
	const captureProps = {
		onSubmitCapture: handleSubmitCapture,
	} as Pick<ComponentProps<"form">, "onSubmitCapture">;

	return (
		<HeroForm {...props} {...captureProps}>
			{children}
		</HeroForm>
	);
}

export function Form<TState extends object, TSchema extends object>({
	children,
	state,
	schema,
	readOnly = false,
	validationTimings,
	...props
}: FormProps<TState, TSchema>) {
	return (
		<FormValidationProvider
			state={state as FormStateContract}
			schema={schema as SchemaClass<object> | undefined}
			readOnly={readOnly}
			validationTimings={validationTimings}
		>
			<FormRoot {...props}>{children}</FormRoot>
		</FormValidationProvider>
	);
}

export type { FormValidationTiming };

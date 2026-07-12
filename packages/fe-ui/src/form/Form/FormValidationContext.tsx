"use client";

import type { SchemaClass } from "@cocrepo/schema";
import {
	validateFieldSync,
	validateSchemaToFieldErrorsSync,
} from "@cocrepo/schema";
import type { FormStateContract } from "@cocrepo/type";
import { runInAction } from "mobx";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
} from "react";

export type FormValidationTiming = "onChange" | "onBlur" | "onFocus";

export interface FormValidationContextValue {
	state: FormStateContract;
	schema?: SchemaClass<object>;
	readOnly: boolean;
	validationTimings: FormValidationTiming[];
	getFieldError: (path: string) => string | undefined;
	setFieldError: (path: string, message?: string | null) => void;
	validateField: (
		path: string,
		value: unknown,
		timing: FormValidationTiming,
	) => boolean;
	validateAll: () => boolean;
}

interface FormValidationProviderProps {
	children: ReactNode;
	state: FormStateContract;
	schema?: SchemaClass<object>;
	readOnly?: boolean;
	validationTimings?: FormValidationTiming[];
}

const DEFAULT_VALIDATION_TIMINGS: FormValidationTiming[] = ["onBlur"];

const FormValidationContext = createContext<FormValidationContextValue | null>(
	null,
);

function hasFieldErrors(state: FormStateContract): boolean {
	return "fieldErrors" in state && typeof state.fieldErrors === "object";
}

export function FormValidationProvider({
	children,
	state,
	schema,
	readOnly = false,
	validationTimings = DEFAULT_VALIDATION_TIMINGS,
}: FormValidationProviderProps) {
	const getFieldError = useCallback(
		(path: string) => state.fieldErrors?.[path],
		[state],
	);

	const setFieldError = useCallback(
		(path: string, message?: string | null) => {
			if (!hasFieldErrors(state)) {
				return;
			}

			runInAction(() => {
				if (state.setFieldError) {
					state.setFieldError(path, message);
					return;
				}

				if (message) {
					state.fieldErrors[path] = message;
					return;
				}

				delete state.fieldErrors[path];
			});
		},
		[state],
	);

	const validateField = useCallback(
		(path: string, _value: unknown, timing: FormValidationTiming) => {
			if (
				readOnly ||
				!schema ||
				!hasFieldErrors(state) ||
				!validationTimings.includes(timing)
			) {
				return true;
			}

			const fieldError = validateFieldSync(schema, state, path);
			setFieldError(path, fieldError?.messages[0] ?? null);

			return !fieldError;
		},
		[readOnly, schema, setFieldError, state, validationTimings],
	);

	const validateAll = useCallback(() => {
		if (readOnly || !schema || !hasFieldErrors(state)) {
			return true;
		}

		const fieldErrors = validateSchemaToFieldErrorsSync(schema, state);

		runInAction(() => {
			if (state.clearFieldErrors) {
				state.clearFieldErrors();
			} else {
				for (const path of Object.keys(state.fieldErrors)) {
					delete state.fieldErrors[path];
				}
			}

			for (const [path, message] of Object.entries(fieldErrors)) {
				if (!message) {
					continue;
				}

				if (state.setFieldError) {
					state.setFieldError(path, message);
					continue;
				}

				state.fieldErrors[path] = message;
			}
		});

		return Object.keys(fieldErrors).length === 0;
	}, [readOnly, schema, state]);

	const context = useMemo<FormValidationContextValue>(
		() => ({
			state,
			schema,
			readOnly,
			validationTimings,
			getFieldError,
			setFieldError,
			validateField,
			validateAll,
		}),
		[
			getFieldError,
			readOnly,
			schema,
			setFieldError,
			state,
			validateAll,
			validateField,
			validationTimings,
		],
	);

	return (
		<FormValidationContext.Provider value={context}>
			{children}
		</FormValidationContext.Provider>
	);
}

export function useFormValidationContext() {
	return useContext(FormValidationContext);
}

export function useFormValidationField(path?: string) {
	const context = useFormValidationContext();
	const errorMessage =
		path && context ? context.getFieldError(path) : undefined;

	return {
		readOnly: context?.readOnly ?? false,
		isInvalid: Boolean(errorMessage),
		errorMessage,
		validate: (timing: FormValidationTiming, value: unknown) => {
			if (!context || !path) {
				return true;
			}

			return context.validateField(path, value, timing);
		},
	};
}

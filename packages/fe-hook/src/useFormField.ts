"use client";

import { tools } from "@cocrepo/toolkit";
import type {
	Paths,
	PathTuple,
	UseFormFieldMultiOptions,
	UseFormFieldReturn,
	UseFormFieldSingleOptions,
	ValueAggregator,
	ValueSplitter,
} from "@cocrepo/type";
import { action } from "mobx";
import { useMemo, useRef } from "react";

export type {
	UseFormFieldMultiOptions,
	UseFormFieldReturn,
	UseFormFieldSingleOptions,
} from "@cocrepo/type";

type SinglePathOptions<TState extends object, TValue> = Omit<
	UseFormFieldSingleOptions<TState, TValue, Paths<TState, 4>>,
	"value"
> & {
	value?: TValue;
	defaultValue?: TValue;
};

type MultiPathOptions<
	TState extends object,
	TValue,
	TPaths extends PathTuple<TState> = PathTuple<TState>,
> = Omit<UseFormFieldMultiOptions<TState, TValue, TPaths>, "value"> & {
	value?: TValue;
	defaultValue?: TValue;
	valueSplitter: ValueSplitter<TValue, TPaths>;
	valueAggregator?: ValueAggregator<TValue, TPaths>;
};

type FormFieldOptions<
	TState extends object,
	TValue,
	TPaths extends PathTuple<TState> = PathTuple<TState>,
> =
	| SinglePathOptions<TState, TValue>
	| MultiPathOptions<TState, TValue, TPaths>;

function isSinglePathOptions<
	TState extends object,
	TValue,
	TPaths extends PathTuple<TState>,
>(
	options: FormFieldOptions<TState, TValue, TPaths>,
): options is SinglePathOptions<TState, TValue> {
	return "path" in options && typeof options.path === "string";
}

export function useFormField<
	TState extends object = Record<string, unknown>,
	TValue = unknown,
>(options: SinglePathOptions<TState, TValue>): UseFormFieldReturn<TValue>;

export function useFormField<
	TState extends object = Record<string, unknown>,
	TValue = unknown,
	TPaths extends PathTuple<TState> = PathTuple<TState>,
>(
	options: MultiPathOptions<TState, TValue, TPaths>,
): UseFormFieldReturn<TValue>;

export function useFormField<
	TState extends object = Record<string, unknown>,
	TValue = unknown,
	TPaths extends PathTuple<TState> = PathTuple<TState>,
>(
	options: FormFieldOptions<TState, TValue, TPaths>,
): UseFormFieldReturn<TValue>;

export function useFormField<
	TState extends object = Record<string, unknown>,
	TValue = unknown,
	TPaths extends PathTuple<TState> = PathTuple<TState>,
>(
	options: FormFieldOptions<TState, TValue, TPaths>,
): UseFormFieldReturn<TValue> {
	const isSinglePath = isSinglePathOptions(options);
	const fallbackValue = options.value !== undefined
		? options.value
		: options.defaultValue;
	const pathDependency = isSinglePath
		? options.path
		: options.paths.join("\u0000");
	const latestOptionsRef = useRef(options);
	latestOptionsRef.current = options;

	return useMemo(() => {
		if (isSinglePath) {
			const state = {
				get value() {
					const externalValue = tools.get(options.state, options.path);
					return (externalValue === undefined
						? fallbackValue
						: externalValue) as TValue;
				},
				set value(nextValue: TValue) {
					tools.set(options.state, options.path, nextValue);
				},
			};

			return {
				state,
				setValue: action(
					`useFormField.setValue[${String(options.path)}]`,
					(nextValue: TValue) => {
						state.value = nextValue;
					},
				),
			};
		}

		let multiValue = fallbackValue as TValue;
		const state = {
			get value() {
				const currentOptions = latestOptionsRef.current as MultiPathOptions<
					TState,
					TValue,
					TPaths
				>;
				const values: Record<string, unknown> = {};
				currentOptions.paths.forEach((path: string) => {
					values[path] = tools.get(currentOptions.state, path);
				});
				return currentOptions.valueAggregator
					? currentOptions.valueAggregator(values, currentOptions.paths)
					: multiValue;
			},
			set value(nextValue: TValue) {
				const currentOptions = latestOptionsRef.current as MultiPathOptions<
					TState,
					TValue,
					TPaths
				>;
				multiValue = nextValue;
				const mapped = currentOptions.valueSplitter(nextValue, currentOptions.paths);
				currentOptions.paths.forEach((path: string) => {
					tools.set(currentOptions.state, path, mapped[path]);
				});
			},
		};

		return {
			state,
			setValue: action(
				`useFormField.setValue[${options.paths.join(",")}]`,
				(nextValue: TValue) => {
					state.value = nextValue;
				},
			),
		};
	}, [fallbackValue, isSinglePath, options.state, pathDependency]);
}

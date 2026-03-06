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
import { action, reaction } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

export type {
	UseFormFieldMultiOptions,
	UseFormFieldReturn,
	UseFormFieldSingleOptions,
} from "@cocrepo/type";

type SinglePathOptions<
	TState extends object,
	TValue,
> = UseFormFieldSingleOptions<TState, TValue, Paths<TState, 4>>;

type MultiPathOptions<
	TState extends object,
	TValue,
	TPaths extends PathTuple<TState> = PathTuple<TState>,
> = UseFormFieldMultiOptions<TState, TValue, TPaths> & {
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

// Single-path overload
export function useFormField<
	TState extends object = Record<string, unknown>,
	TValue = unknown,
>(options: SinglePathOptions<TState, TValue>): UseFormFieldReturn<TValue>;

// Multi-path overload
export function useFormField<
	TState extends object = Record<string, unknown>,
	TValue = unknown,
	TPaths extends PathTuple<TState> = PathTuple<TState>,
>(
	options: MultiPathOptions<TState, TValue, TPaths>,
): UseFormFieldReturn<TValue>;

// Implementation
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
	const debugPath = isSinglePath
		? String(options.path)
		: options.paths.join(",");
	const pathDependency = isSinglePath ? options.path : options.paths;
	const splitterDependency = isSinglePath ? undefined : options.valueSplitter;
	const aggregatorDependency = isSinglePath
		? undefined
		: options.valueAggregator;

	const localState = useLocalObservable(() => ({
		value: options.value,
	}));

	// setValue with action wrapper and debug name
	const setValue = action((newValue: TValue) => {
		localState.value = newValue;
	}, `useFormField.setValue[${debugPath}]`) as unknown as (
		value: TValue,
	) => void;

	useEffect(() => {
		if (isSinglePath) {
			const setterDisposer = reaction(
				() => localState.value,
				(value) => {
					tools.set(options.state, options.path, value);
				},
			);

			const getterDisposer = reaction(
				() => tools.get(options.state, options.path),
				(value) => {
					localState.value = value as TValue;
				},
			);

			return () => {
				setterDisposer();
				getterDisposer();
			};
		} else {
			const setterDisposer = reaction(
				() => localState.value,
				(value) => {
					// Use valueSplitter to split value to each path
					const mapped = options.valueSplitter(value, options.paths);
					options.paths.forEach((path: string) => {
						tools.set(options.state, path, mapped[path]);
					});
				},
			);

			const getterDisposer = reaction(
				() => {
					// Get values from all paths and combine into object
					const values: Record<string, unknown> = {};
					options.paths.forEach((path: string) => {
						values[path] = tools.get(options.state, path);
					});
					return values;
				},
				(values) => {
					// Use valueAggregator to aggregate values if provided
					if (options.valueAggregator) {
						localState.value = options.valueAggregator(values, options.paths);
					}
				},
			);

			return () => {
				setterDisposer();
				getterDisposer();
			};
		}
	}, [
		localState,
		isSinglePath,
		options.state,
		pathDependency,
		splitterDependency,
		aggregatorDependency,
	]);

	return {
		state: localState,
		setValue,
	};
}

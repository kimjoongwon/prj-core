import type { PathCombiner, PathMapper, Paths, PathTuple } from "@cocrepo/types";
import { tools } from "@cocrepo/toolkit";
import { action, reaction } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { useEffect, useMemo } from "react";

// Single-path options
export interface UseFormFieldSingleOptions<TState = any, TValue = any> {
	value: TValue;
	state: TState;
	path: Paths<TState, 4>;
}

// Multi-path options
export interface UseFormFieldMultiOptions<
	TState = any,
	TValue = any,
	TPaths extends PathTuple<TState> = PathTuple<TState>
> {
	value: TValue;
	state: TState;
	paths: TPaths;
	pathMapper: PathMapper<TValue, TPaths>;
	pathCombiner?: PathCombiner<TValue, TPaths>;
}

// Return type
export interface UseFormFieldReturn<TValue> {
	state: { value: TValue };
	setValue: (value: TValue) => void;
}

// Single-path overload
export function useFormField<TState = any, TValue = any>(
	options: UseFormFieldSingleOptions<TState, TValue>
): UseFormFieldReturn<TValue>;

// Multi-path overload
export function useFormField<
	TState = any,
	TValue = any,
	TPaths extends PathTuple<TState> = PathTuple<TState>
>(
	options: UseFormFieldMultiOptions<TState, TValue, TPaths>
): UseFormFieldReturn<TValue>;

// Implementation
export function useFormField<TState = any, TValue = any>(
	options:
		| UseFormFieldSingleOptions<TState, TValue>
		| UseFormFieldMultiOptions<TState, TValue, any>
): UseFormFieldReturn<TValue> {
	const isSinglePath = "path" in options;

	const localState = useLocalObservable(() => ({
		value: options.value as TValue,
	}));

	// setValue with action wrapper and debug name
	const setValue = useMemo(
		() =>
			action(
				(newValue: TValue) => {
					localState.value = newValue;
				},
				`useFormField.setValue[${isSinglePath ? String(options.path) : (options as any).paths.join(",")}]`
			) as unknown as (value: TValue) => void,
		[localState, isSinglePath]
	);

	useEffect(() => {
		if (isSinglePath) {
			// Single-path logic
			const singleOptions = options as UseFormFieldSingleOptions<TState, TValue>;

			const setterDisposer = reaction(
				() => localState.value,
				(value) => {
					tools.set(singleOptions.state, singleOptions.path, value);
				}
			);

			const getterDisposer = reaction(
				() => tools.get(singleOptions.state, singleOptions.path),
				(value) => {
					localState.value = value as TValue;
				}
			);

			return () => {
				setterDisposer();
				getterDisposer();
			};
		} else {
			// Multi-path logic
			const multiOptions = options as UseFormFieldMultiOptions<TState, TValue, any>;

			const setterDisposer = reaction(
				() => localState.value,
				(value) => {
					// Use pathMapper to map value to each path
					const mapped = multiOptions.pathMapper(value, multiOptions.paths);
					multiOptions.paths.forEach((path: string) => {
						tools.set(multiOptions.state, path, mapped[path]);
					});
				}
			);

			const getterDisposer = reaction(
				() => {
					// Get values from all paths and combine into object
					const values: Record<string, any> = {};
					multiOptions.paths.forEach((path: string) => {
						values[path] = tools.get(multiOptions.state, path);
					});
					return values;
				},
				(values) => {
					// Use pathCombiner to combine values if provided
					if (multiOptions.pathCombiner) {
						localState.value = multiOptions.pathCombiner(values, multiOptions.paths);
					}
				}
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
		isSinglePath ? (options as any).path : (options as any).paths,
		!isSinglePath ? (options as any).pathMapper : undefined,
		!isSinglePath ? (options as any).pathCombiner : undefined,
	]);

	return {
		state: localState,
		setValue,
	};
}

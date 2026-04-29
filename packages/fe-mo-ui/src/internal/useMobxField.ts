import { action, reaction } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import { getPathValue, setPathValue } from "./objectPath";

export interface MobxProps<TState extends object = Record<string, unknown>> {
	path: string;
	state: TState;
}

interface UseMobxFieldOptions<TState extends object, TValue> {
	fallback: TValue;
	path: string;
	state: TState;
}

export function useMobxField<TState extends object, TValue>(
	options: UseMobxFieldOptions<TState, TValue>,
) {
	const { fallback, path, state } = options;

	const localState = useLocalObservable(() => ({
		value: getPathValue(state, path, fallback),
	}));

	const setValue = action(
		(nextValue: TValue) => {
			localState.value = nextValue;
		},
		`useMobxField.setValue[${path}]`,
	) as unknown as (nextValue: TValue) => void;

	useEffect(() => {
		const setLocalValue = action(
			(nextValue: TValue) => {
				localState.value = nextValue;
			},
			`useMobxField.setLocalValue[${path}]`,
		) as unknown as (nextValue: TValue) => void;
		const setStateValue = action(
			(nextValue: TValue) => {
				setPathValue(state as Record<string, unknown>, path, nextValue);
			},
			`useMobxField.setStateValue[${path}]`,
		) as unknown as (nextValue: TValue) => void;

		setLocalValue(getPathValue(state, path, fallback));

		const fromLocalDisposer = reaction(
			() => localState.value,
			setStateValue,
		);

		const fromStateDisposer = reaction(
			() => getPathValue(state, path, fallback),
			setLocalValue,
		);

		return () => {
			fromLocalDisposer();
			fromStateDisposer();
		};
	}, [fallback, localState, path, state]);

	return {
		setValue,
		value: localState.value as TValue,
	};
}

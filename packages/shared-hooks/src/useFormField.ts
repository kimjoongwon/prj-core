import { Tool } from "@shared/utils";
import type { MobxProps } from "@shared/types";
import { reaction } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

export interface UseFormFieldOptions<TState = any, TValue = any>
	extends Pick<MobxProps<TState>, "state" | "path"> {
	initialValue: TValue;
}

export const useFormField = <TState = any, TValue = any>({
	initialValue,
	state,
	path,
}: UseFormFieldOptions<TState, TValue>) => {
	const localState = useLocalObservable(() => ({
		value: initialValue,
	}));

	useEffect(() => {
		const setterDisposer = reaction(
			() => localState.value,
			(value) => {
				Tool.set(state, path, value);
			},
		);

		const getterDisposer = reaction(
			() => Tool.get(state, path),
			(value) => {
				localState.value = value;
			},
		);

		return () => {
			setterDisposer();
			getterDisposer();
		};
	}, [localState, state, path]);

	return {
		localState,
	};
};

import { get, set } from "lodash-es";
import { reaction } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

export const useMobxHookForm = (initialValue: any, state: any, path: any) => {
	const localState = useLocalObservable(() => ({
		value: initialValue,
	}));

	useEffect(() => {
		const setterDisposer = reaction(
			() => localState.value,
			(value) => {
				set(state, path, value);
			},
		);

		const getterDisposer = reaction(
			() => get(state, path),
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

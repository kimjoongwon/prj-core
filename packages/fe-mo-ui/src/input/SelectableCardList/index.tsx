"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import type { MobxProps, Paths } from "@cocrepo/type";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import {
	PureSelectableCardList,
	type PureSelectableCardListProps,
} from "./SelectableCardList";
import { useRegisterInputState } from "../input-state-inspection";

type BoundSelectableCardListProps<TState extends object> = MobxProps<TState> &
	(Omit<PureSelectableCardListProps, "onSelect" | "selectedValue"> & {
		selectedValue?: never;
		defaultValue?: string | null;
		onSelect?: PureSelectableCardListProps["onSelect"];
	});
type UnboundSelectableCardListProps = Omit<
	PureSelectableCardListProps,
	"onSelect" | "selectedValue"
> & {
	state?: never;
	path?: never;
	selectedValue?: string | null;
	defaultValue?: string | null;
	onSelect?: PureSelectableCardListProps["onSelect"];
};
export type SelectableCardListProps<
	TState extends object = Record<string, unknown>,
> = BoundSelectableCardListProps<TState> | UnboundSelectableCardListProps;
export function createSelectableCardListState(value: string | null = null) {
	const state = {
		value,
		setValue(nextValue: string | null) {
			state.value = nextValue;
		},
	};
	return makeAutoObservable(
		state,
		{},
		{ autoBind: true, name: "SelectableCardListState" },
	);
}
export type SelectableCardListState = ReturnType<
	typeof createSelectableCardListState
>;

const SelectableCardList = observer(
	<TState extends object>(props: SelectableCardListProps<TState>) => {
		const {
			defaultValue,
			onSelect,
			path,
			selectedValue: controlledValue,
			state,
			...rest
		} = props;
		const localState = useLocalObservable(() =>
			createSelectableCardListState(defaultValue ?? null),
		);
		const field = useFormField<TState, string | null>({
			path: (state && path ? path : "value") as Paths<TState, 4>,
			state: (state ?? localState) as TState,
			defaultValue: defaultValue ?? null,
		});
		const isBound = state !== undefined && path !== undefined;
		const isControlled = !isBound && controlledValue !== undefined;
		const selectedValue = isControlled ? controlledValue : field.state.value;
		useRegisterInputState(
			() => (isControlled ? controlledValue : field.state.value),
			isControlled ? controlledValue : field.state.value,
		);
		const handleSelect: PureSelectableCardListProps["onSelect"] = (value) => {
			if (!isControlled) field.setValue(value);
			onSelect?.(value);
		};

		return (
			<PureSelectableCardList
				{...rest}
				onSelect={handleSelect}
				selectedValue={selectedValue}
			/>
		);
	},
);
SelectableCardList.displayName = "SelectableCardList";

export { SelectableCardList };
export { PureSelectableCardList };
export type {
	PureSelectableCardListProps,
	SelectableCardItem,
} from "./SelectableCardList";

"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import type { MobxProps, Paths } from "@cocrepo/type";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { PureDateStrip, type PureDateStripProps } from "./DateStrip";
import { useRegisterInputState } from "../input-state-inspection";

type BoundDateStripProps<TState extends object> = MobxProps<TState> &
	(Omit<PureDateStripProps, "onSelect" | "selectedValue"> & {
		selectedValue?: never;
		defaultValue?: string | null;
		onSelect?: PureDateStripProps["onSelect"];
	});
type UnboundDateStripProps = Omit<
	PureDateStripProps,
	"onSelect" | "selectedValue"
> & {
	state?: never;
	path?: never;
	selectedValue?: string | null;
	defaultValue?: string | null;
	onSelect?: PureDateStripProps["onSelect"];
};
export type DateStripProps<TState extends object = Record<string, unknown>> =
	| BoundDateStripProps<TState>
	| UnboundDateStripProps;
export function createDateStripState(value: string | null = null) {
	const state = {
		value,
		setValue(nextValue: string | null) {
			state.value = nextValue;
		},
	};
	return makeAutoObservable(
		state,
		{},
		{ autoBind: true, name: "DateStripState" },
	);
}
export type DateStripState = ReturnType<typeof createDateStripState>;

const DateStrip = observer(
	<TState extends object>(props: DateStripProps<TState>) => {
		const {
			defaultValue,
			onSelect,
			path,
			selectedValue: controlledValue,
			state,
			...rest
		} = props;
		const localState = useLocalObservable(() =>
			createDateStripState(defaultValue ?? null),
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
		const handleSelect: PureDateStripProps["onSelect"] = (value, option) => {
			if (!isControlled) field.setValue(value);
			onSelect?.(value, option);
		};

		return (
			<PureDateStrip
				{...rest}
				onSelect={handleSelect}
				selectedValue={selectedValue}
			/>
		);
	},
);
DateStrip.displayName = "DateStrip";

export { DateStrip };
export { PureDateStrip };
export type { DateStripOption, PureDateStripProps } from "./DateStrip";

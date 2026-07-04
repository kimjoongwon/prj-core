"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	PureSelectableCardList,
	type PureSelectableCardListProps,
} from "./SelectableCardList";

export interface SelectableCardListProps<
	TState extends object = Record<string, unknown>,
> extends MobxProps<TState>,
		Omit<PureSelectableCardListProps, "onSelect" | "selectedValue"> {
	onSelect?: PureSelectableCardListProps["onSelect"];
}

const SelectableCardList = observer(
	<TState extends object>(props: SelectableCardListProps<TState>) => {
		const { onSelect, path, state, ...rest } = props;
		const field = useFormField<TState, string | null>({
			path,
			state,
			value: (tools.get(state, path) ?? null) as string | null,
		});
		const handleSelect: PureSelectableCardListProps["onSelect"] = (value) => {
			field.setValue(value);
			onSelect?.(value);
		};

		return (
			<PureSelectableCardList
				{...rest}
				onSelect={handleSelect}
				selectedValue={field.state.value}
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

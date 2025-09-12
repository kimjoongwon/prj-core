import { useFormField } from "@shared/hooks";
import { MobxProps } from "@shared/types";
import { get } from "lodash-es";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useCallback } from "react";
import {
	ListSelectMultipleProps as BaseListSelectMultipleProps,
	ListSelectProps as BaseListSelectProps,
	ListSelectSingleProps as BaseListSelectSingleProps,
	ListSelect as ListSelectComponent,
	SelectionMode,
} from "./ListSelect";

// Single 모드용 MobX Props
export interface MobxListSelectSingleProps<T extends object, D extends object>
	extends MobxProps<T>,
		Omit<
			BaseListSelectSingleProps<D>,
			"selectedItems" | "onChangeSelection" | "selectionMode"
		> {
	data: D[];
	renderItem: (data: D, isSelected: boolean, index: number) => React.ReactNode;
	selectionMode: "single";
}

// Multiple 모드용 MobX Props
export interface MobxListSelectMultipleProps<T extends object, D extends object>
	extends MobxProps<T>,
		Omit<
			BaseListSelectMultipleProps<D>,
			"selectedItems" | "onChangeSelection" | "selectionMode"
		> {
	data: D[];
	renderItem: (data: D, isSelected: boolean, index: number) => React.ReactNode;
	selectionMode: "multiple";
}

export type MobxListSelectProps<T extends object, D extends object> =
	| MobxListSelectSingleProps<T, D>
	| MobxListSelectMultipleProps<T, D>;

export function ListSelect<T extends object, D extends object>(
	props: MobxListSelectSingleProps<T, D>,
): React.ReactElement;
export function ListSelect<T extends object, D extends object>(
	props: MobxListSelectMultipleProps<T, D>,
): React.ReactElement;
export function ListSelect<T extends object, D extends object>(
	props: MobxListSelectProps<T, D>,
): React.ReactElement {
	const { state, path, selectionMode, defaultSelectedItems, ...rest } = props;

	if (selectionMode === "single") {
		const initialValue = get(state, path || "", null) as D | null;

		const { localState } = useFormField<T, D | null>({
			initialValue,
			state,
			path,
		});

		const handleChangeSelection = useCallback(
			action((selectedData: D | null) => {
				localState.value = selectedData;
			}),
			[localState],
		);

		return (
			<ListSelectComponent
				{...rest}
				selectionMode="single"
				selectedItems={localState.value}
				onChangeSelection={handleChangeSelection}
				defaultSelectedItems={defaultSelectedItems as D | null | undefined}
			/>
		);
	} else {
		const initialValue = get(state, path || "", []) as D[];

		const { localState } = useFormField<T, D[]>({
			initialValue,
			state,
			path,
		});

		const handleChangeSelection = useCallback(
			action((selectedData: D[]) => {
				localState.value = selectedData;
			}),
			[localState],
		);

		return (
			<ListSelectComponent
				{...rest}
				selectionMode="multiple"
				selectedItems={localState.value}
				onChangeSelection={handleChangeSelection}
				defaultSelectedItems={defaultSelectedItems as D[] | undefined}
			/>
		);
	}
}

export const ObservedListSelect = observer(ListSelect);

ObservedListSelect.displayName = "MobxListSelect";

// 기본 컴포넌트도 export
export { ListSelectComponent };
export type {
	BaseListSelectProps,
	BaseListSelectSingleProps,
	BaseListSelectMultipleProps,
	SelectionMode,
};

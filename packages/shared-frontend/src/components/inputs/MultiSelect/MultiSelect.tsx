import {
	Select as NextSelect,
	SelectProps as NextUISelectProps,
	SelectItem,
} from "@heroui/react";
import { get, set } from "lodash-es";
import { reaction } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import type { MobxProps } from "../../../types";

interface SelectProps<T>
	extends Omit<NextUISelectProps, "children">,
		MobxProps<T> {
	options?: any[];
}

export const MultiSelect = observer(
	<T extends object>(props: SelectProps<T>) => {
		const { state = {}, path = "", options = [], ...rest } = props;

		const defaultValues = get(state, path) || ([] as string[]);

		const localState = useLocalObservable<{ value: string[] }>(() => ({
			// @ts-ignore
			value: defaultValues,
		}));

		useEffect(() => {
			const disposer = reaction(
				() => localState.value,
				(value) => {
					set(state, path, value);
				},
			);

			return () => {
				disposer();
			};
		}, [localState.value, path, state]);

		useEffect(() => {
			const disposer = reaction(
				() => get(state, path),
				(value) => {
					// @ts-ignore
					localState.value = value || [];
				},
			);

			return () => {
				disposer();
			};
		}, [
			// @ts-ignore
			localState,
			path,
			state,
		]);

		return (
			<NextSelect
				variant="bordered"
				{...rest}
				selectionMode="multiple"
				onChange={(e) => {
					localState.value = e.target.value?.split(",") || [];
				}}
				selectedKeys={new Set(localState.value)}
			>
				{options.map((option) => {
					return <SelectItem key={option.value}>{option.name}</SelectItem>;
				})}
			</NextSelect>
		);
	},
);

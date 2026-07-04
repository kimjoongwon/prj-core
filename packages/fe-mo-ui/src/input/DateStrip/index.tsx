"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { PureDateStrip, type PureDateStripProps } from "./DateStrip";

export interface DateStripProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<PureDateStripProps, "onSelect" | "selectedValue"> {
	onSelect?: PureDateStripProps["onSelect"];
}

const DateStrip = observer(
	<TState extends object>(props: DateStripProps<TState>) => {
		const { onSelect, path, state, ...rest } = props;
		const field = useFormField<TState, string | null>({
			path,
			state,
			value: (tools.get(state, path) ?? null) as string | null,
		});
		const handleSelect: PureDateStripProps["onSelect"] = (value, option) => {
			field.setValue(value);
			onSelect?.(value, option);
		};

		return (
			<PureDateStrip
				{...rest}
				onSelect={handleSelect}
				selectedValue={field.state.value}
			/>
		);
	},
);
DateStrip.displayName = "DateStrip";

export { DateStrip };
export { PureDateStrip };
export type { DateStripOption, PureDateStripProps } from "./DateStrip";

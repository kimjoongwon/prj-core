"use client";

import { type Translate, useT } from "../../../i18n";
import type { DefaultCellProps } from "./DefaultCell";

export function translateDisplayValue(
	displayValue: string,
	translate: Translate,
) {
	const minutesSeconds = displayValue.match(/^(\d+)분\s+(\d+)초$/);
	if (minutesSeconds) {
		return translate("{{minutes}}분 {{seconds}}초", undefined, {
			minutes: minutesSeconds[1],
			seconds: minutesSeconds[2],
		});
	}
	const seconds = displayValue.match(/^(\d+)초$/);
	if (seconds) {
		return translate("{{seconds}}초", undefined, { seconds: seconds[1] });
	}
	const count = displayValue.match(/^(\d+)회$/);
	if (count) {
		return translate("{{count}}회", undefined, { count: count[1] });
	}
	const itemCount = displayValue.match(/^(\d+)개$/);
	if (itemCount) {
		return translate("{{count}}개", undefined, { count: itemCount[1] });
	}
	return translate(displayValue);
}

export function useHandlers(state: DefaultCellProps) {
	const translate = useT();
	return {
		getDisplayPresentation: () => {
			const isEmptyValue =
				state.value === null || state.value === undefined || state.value === "";
			const displayValue = isEmptyValue
				? (state.placeholder ?? "-")
				: String(state.value);
			return {
				isEmptyValue,
				translatedDisplayValue: translateDisplayValue(displayValue, translate),
				translatedTitle: state.title ? translate(state.title) : state.title,
			};
		},
	};
}

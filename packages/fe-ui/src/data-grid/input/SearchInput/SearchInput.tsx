"use client";

import type { DataGridQueryState, InputConfig } from "@cocrepo/type";
import { Search } from "lucide-react";
import { observable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import { useT } from "../../../i18n";
import { getSearchQueryValue, useHandlers } from "./useHandlers";

export interface SearchInputProps {
	config: InputConfig;
	queryValues: DataGridQueryState;
	onQueryChange: (values: Record<string, unknown | null>) => void;
}

export interface SearchInputState {
	inputValue: string;
	config: SearchInputProps;
}

export const SearchInput = observer((props: SearchInputProps) => {
	const { config } = props;
	const t = useT();
	const query = getSearchQueryValue(props);
	const state = useLocalObservable(() =>
		observable<SearchInputState>(
			{ inputValue: query, config: props },
			{ config: false },
			{ name: "SearchInputState" },
		),
	);
	const handlers = useHandlers(state);

	useEffect(() => {
		handlers.syncConfig(props);
	}, [props, state]);

	useEffect(() => {
		handlers.syncInputValue(query);
	}, [query, state]);

	return (
		<div className="relative w-full min-w-0">
			<Search
				size={13}
				className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-muted"
			/>
			<input
				aria-label={config.label ? t(config.label) : t("검색")}
				className="h-7 w-full rounded-sm border border-field-border bg-field pl-7 pr-6 text-[12px] font-normal text-field-foreground outline-none transition-colors placeholder:text-field-placeholder hover:border-field-border-hover focus:border-field-border-focus focus-field-ring"
				onChange={handlers.changeInputValue}
				onKeyDown={handlers.commitQueryOnEnter}
				placeholder={config.placeholder ? t(config.placeholder) : undefined}
				value={state.inputValue}
			/>
			{state.inputValue ? (
				<button
					aria-label={t("검색어 지우기")}
					className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[13px] leading-none text-muted hover:text-foreground"
					onClick={handlers.clearQuery}
					type="button"
				>
					x
				</button>
			) : null}
		</div>
	);
});

"use client";

import type { DataGridQueryStates, InputConfig } from "@cocrepo/type";
import { Search } from "lucide-react";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { type KeyboardEvent, useEffect } from "react";
import { useT } from "../../i18n";

interface SearchInputProps {
	config: InputConfig;
	queryValues: DataGridQueryStates;
	onQueryChange: (values: Record<string, unknown | null>) => void;
}

class SearchInputState {
	inputValue: string;

	constructor(inputValue: string) {
		this.inputValue = inputValue;
		makeAutoObservable(this, {}, { autoBind: true });
	}

	syncInputValue(inputValue: string) {
		this.inputValue = inputValue;
	}

	changeInputValue(inputValue: string) {
		this.inputValue = inputValue;
	}

	clearInputValue() {
		this.inputValue = "";
	}
}

export const SearchInput = observer(
	({ config, queryValues, onQueryChange }: SearchInputProps) => {
		const t = useT();
		const queryKey = config.props?.queryKey ?? config.id;
		const query =
			typeof queryValues[queryKey] === "string"
				? (queryValues[queryKey] as string)
				: "";
		const state = useLocalObservable(() => new SearchInputState(query));

		useEffect(() => {
			state.syncInputValue(query);
		}, [query, state]);

		const commitQuery = () => {
			void onQueryChange({
				[queryKey]: state.inputValue.trim() || null,
				skip: 0,
			});
		};

		const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
			if (event.key !== "Enter") {
				return;
			}

			event.preventDefault();
			commitQuery();
		};

		const handleClear = () => {
			state.clearInputValue();
			void onQueryChange({
				[queryKey]: null,
				skip: 0,
			});
		};

		return (
			<div className="relative w-full min-w-0">
				<Search
					size={13}
					className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-muted"
				/>
				<input
					aria-label={config.label ? t(config.label) : t("검색")}
					className="h-7 w-full rounded-sm border border-field-border bg-field pl-7 pr-6 text-[12px] font-normal text-field-foreground outline-none transition-colors placeholder:text-field-placeholder hover:border-field-border-hover focus:border-field-border-focus focus-field-ring"
					onChange={(event) =>
						state.changeInputValue(event.currentTarget.value)
					}
					onKeyDown={handleKeyDown}
					placeholder={config.placeholder ? t(config.placeholder) : undefined}
					value={state.inputValue}
				/>
				{state.inputValue ? (
					<button
						aria-label={t("검색어 지우기")}
						className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[13px] leading-none text-muted hover:text-foreground"
						onClick={handleClear}
						type="button"
					>
						x
					</button>
				) : null}
			</div>
		);
	},
);

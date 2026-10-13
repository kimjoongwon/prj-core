import { action } from "mobx";
import type { ChangeEvent, KeyboardEvent } from "react";
import type { SearchInputProps, SearchInputState } from "./SearchInput";

export function getSearchQueryValue(state: SearchInputProps) {
	const queryKey = state.config.props?.queryKey ?? state.config.id;
	const queryValue = state.queryValues[queryKey];
	return typeof queryValue === "string" ? queryValue : "";
}

export function useHandlers(state: SearchInputState) {
	const commitQuery = () => {
		const { config, onQueryChange } = state.config;
		const queryKey = config.props?.queryKey ?? config.id;
		void onQueryChange({
			[queryKey]: state.inputValue.trim() || null,
			skip: 0,
		});
	};

	return {
		syncConfig: action((config: SearchInputProps) => {
			state.config = config;
		}),
		syncInputValue: action((inputValue: string) => {
			state.inputValue = inputValue;
		}),
		changeInputValue: action((event: ChangeEvent<HTMLInputElement>) => {
			state.inputValue = event.currentTarget.value;
		}),
		commitQueryOnEnter(event: KeyboardEvent<HTMLInputElement>) {
			if (event.key !== "Enter") {
				return;
			}
			event.preventDefault();
			commitQuery();
		},
		clearQuery: action(() => {
			state.inputValue = "";
			const { config, onQueryChange } = state.config;
			const queryKey = config.props?.queryKey ?? config.id;
			void onQueryChange({ [queryKey]: null, skip: 0 });
		}),
	};
}

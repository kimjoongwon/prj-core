import { makeAutoObservable } from "mobx";
import type { ProgramPickerOption, ProgramPickerStateOptions } from "./types";

/** ProgramPicker의 검색, 후보, 선택 callback 상태를 소유합니다. */
export class ProgramPickerState {
	readonly searchLabel: string;
	readonly searchPlaceholder: string;
	readonly options: ProgramPickerOption[];
	readonly selectedId?: string;
	searchValue = "";
	private readonly onSelect: ProgramPickerStateOptions["onSelect"];

	constructor(options: ProgramPickerStateOptions) {
		this.searchLabel = options.searchLabel;
		this.searchPlaceholder = options.searchPlaceholder;
		this.options = [...options.options];
		this.selectedId = options.selectedId;
		this.onSelect = options.onSelect;

		makeAutoObservable<this, "onSelect">(this, {
			onSelect: false,
			options: false,
			searchLabel: false,
			searchPlaceholder: false,
			selectedId: false,
		});
	}

	/** 현재 검색어로 필터링하되 기존 선택 항목은 결과에 유지합니다. */
	get visibleOptions(): ProgramPickerOption[] {
		const query = this.searchValue.trim().toLowerCase();
		const filteredOptions = query
			? this.options.filter((option) =>
					option.name.toLowerCase().includes(query),
				)
			: [...this.options];
		const selectedOption = this.options.find(
			(option) => option.id === this.selectedId,
		);

		if (
			selectedOption &&
			!filteredOptions.some((option) => option.id === selectedOption.id)
		) {
			return [selectedOption, ...filteredOptions];
		}

		return filteredOptions;
	}

	/** 검색어를 변경합니다. */
	setSearchValue(value: string): void {
		this.searchValue = value;
	}

	/** 선택 ID와 동일한 ProgramPickerState를 callback에 전달합니다. */
	select(selectedId: string): void {
		this.onSelect(selectedId, this);
	}
}

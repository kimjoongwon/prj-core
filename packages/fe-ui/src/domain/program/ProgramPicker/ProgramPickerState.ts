import { makeAutoObservable } from "mobx";
import type { ProgramPickerOption, ProgramPickerStateOptions } from "./types";

/** ProgramPicker의 조회 종류, 검색어, 선택 callback 상태를 소유합니다. */
export class ProgramPickerState {
	readonly kind: ProgramPickerStateOptions["kind"];
	readonly selectedId?: string;
	searchValue = "";
	private readonly onSelect: ProgramPickerStateOptions["onSelect"];

	constructor(options: ProgramPickerStateOptions) {
		this.kind = options.kind;
		this.selectedId = options.selectedId;
		this.onSelect = options.onSelect;

		makeAutoObservable<this, "onSelect">(this, {
			onSelect: false,
			kind: false,
			selectedId: false,
		});
	}

	/** 검색어를 변경합니다. */
	setSearchValue(value: string): void {
		this.searchValue = value;
	}

	/** API에서 조회한 후보를 callback에 전달합니다. */
	select(option: ProgramPickerOption): void {
		this.onSelect(option.id, option, this);
	}
}

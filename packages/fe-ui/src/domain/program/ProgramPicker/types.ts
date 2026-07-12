import type { ProgramPickerState } from "./ProgramPickerState";

/** ProgramPicker에 표시할 선택 후보입니다. */
export interface ProgramPickerOption {
	id: string;
	name: string;
	subtitle?: string;
}

/** ProgramPickerState 생성 계약입니다. */
export interface ProgramPickerStateOptions {
	searchLabel: string;
	searchPlaceholder: string;
	options: readonly ProgramPickerOption[];
	selectedId?: string;
	onSelect: (selectedId: string, state: ProgramPickerState) => void;
}

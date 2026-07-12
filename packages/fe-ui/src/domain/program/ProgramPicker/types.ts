import type { ProgramPickerState } from "./ProgramPickerState";

/** ProgramPicker가 조회할 API 리소스 종류입니다. */
export type ProgramPickerKind = "routine" | "instructor";

/** ProgramPicker가 API 응답을 화면에 표시하기 위해 사용하는 후보입니다. */
export interface ProgramPickerOption {
	id: string;
	name: string;
	subtitle?: string;
}

/** ProgramPickerState 생성 계약입니다. API 후보는 ProgramPicker가 직접 조회합니다. */
export interface ProgramPickerStateOptions {
	kind: ProgramPickerKind;
	selectedId?: string;
	onSelect: (
		selectedId: string,
		option: ProgramPickerOption,
		state: ProgramPickerState,
	) => void;
}

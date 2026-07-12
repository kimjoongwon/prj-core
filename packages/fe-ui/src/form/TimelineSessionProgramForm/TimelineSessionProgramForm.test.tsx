import { AppContext, ModalStore } from "@cocrepo/store";
import { fireEvent, render, screen } from "@testing-library/react";
import type { AppStore } from "@cocrepo/store";
import { describe, expect, it } from "vitest";
import { ProgramPickerState } from "../../domain/program/ProgramPicker";
import {
	TimelineSessionProgramForm,
	type TimelineSessionProgramFormState,
} from "./TimelineSessionProgramForm";

function createFormState(): TimelineSessionProgramFormState {
	return {
		name: "프로그램",
		routineId: "routine-a",
		routineName: "루틴 A",
		instructorId: "instructor-a",
		instructorName: "강사 A",
		capacity: "10",
		level: "초급",
		errors: {
			routineId: "루틴 오류",
			instructorId: "강사 오류",
		},
	};
}

function renderForm(state: TimelineSessionProgramFormState, modal: ModalStore) {
	return render(
		<AppContext.Provider value={{ modal } as AppStore}>
			<TimelineSessionProgramForm
				state={state}
				routineOptions={[
					{ id: "routine-a", name: "루틴 A", subtitle: "활동 2개" },
					{ id: "routine-b", name: "루틴 B", subtitle: "활동 3개" },
				]}
				instructorOptions={[
					{ id: "instructor-a", name: "강사 A", subtitle: "a@test.com" },
					{ id: "instructor-b", name: "강사 B", subtitle: "b@test.com" },
				]}
				routinePreview={[]}
				hasUnschedulableRoutine={false}
			/>
		</AppContext.Provider>,
	);
}

describe("TimelineSessionProgramForm", () => {
	it("루틴 선택 버튼은 ProgramPickerState로 전역 Modal을 연다", () => {
		const state = createFormState();
		const modal = new ModalStore();
		renderForm(state, modal);

		fireEvent.click(screen.getByRole("button", { name: "루틴 선택" }));

		expect(modal.current?.title).toBe("루틴 선택");
		expect(modal.current?.content.kind).toBe("component");
		const pickerState = modal.current?.contentState;
		expect(pickerState).toBeInstanceOf(ProgramPickerState);
		if (!(pickerState instanceof ProgramPickerState)) {
			throw new Error("ProgramPickerState가 필요합니다.");
		}
		expect(pickerState.selectedId).toBe("routine-a");

		pickerState.select("routine-b");

		expect(state.routineId).toBe("routine-b");
		expect(state.routineName).toBe("루틴 B");
		expect(state.errors.routineId).toBeUndefined();
	});

	it("강사 선택 callback은 form 상태와 오류를 갱신한다", () => {
		const state = createFormState();
		const modal = new ModalStore();
		renderForm(state, modal);

		fireEvent.click(screen.getByRole("button", { name: "강사 선택" }));

		const pickerState = modal.current?.contentState;
		if (!(pickerState instanceof ProgramPickerState)) {
			throw new Error("ProgramPickerState가 필요합니다.");
		}
		pickerState.select("instructor-b");

		expect(state.instructorId).toBe("instructor-b");
		expect(state.instructorName).toBe("강사 B");
		expect(state.errors.instructorId).toBeUndefined();
	});
});

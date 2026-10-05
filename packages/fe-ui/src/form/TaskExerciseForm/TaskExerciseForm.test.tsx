import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	TaskExerciseForm,
	type TaskExerciseFormState,
} from "./TaskExerciseForm";

function createTaskExerciseFormState(
	state: Partial<TaskExerciseFormState> = {},
): TaskExerciseFormState {
	return {
		name: "벤치프레스",
		durationMin: 3,
		durationSec: 30,
		count: 10,
		description: "가슴 운동",
		imageFileId: "",
		videoFileId: "",
		errors: {},
		...state,
	};
}

describe("TaskExerciseForm", () => {
	it("지속시간 라벨을 label 요소와 Typography 스타일로 렌더한다", () => {
		render(<TaskExerciseForm state={createTaskExerciseFormState()} />);

		const durationLabelText = screen.getByText("지속시간", { exact: false });
		const durationLabel = durationLabelText.closest("label");
		expect(durationLabel).not.toBeNull();
		const labelTypography = durationLabel?.querySelector(
			"[data-slot='typography']",
		);
		expect(labelTypography?.className).toContain("typography--body-sm");
		expect(labelTypography?.className).toContain("typography--weight-medium");
	});

	it("지속시간 필드 오류를 Typography 본문 텍스트로 표시한다", () => {
		render(
			<TaskExerciseForm
				state={createTaskExerciseFormState({
					errors: { duration: "지속시간을 입력하세요." },
				})}
			/>,
		);

		const durationError = screen.getByText("지속시간을 입력하세요.");
		expect(durationError.className).toContain("typography--body-sm");
		expect(durationError.className).toContain("text-danger");
	});
});

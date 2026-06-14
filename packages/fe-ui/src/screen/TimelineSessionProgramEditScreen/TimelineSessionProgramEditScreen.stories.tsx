import type { Meta, StoryObj } from "@storybook/react";
import { TimelineSessionProgramEditScreen } from "./TimelineSessionProgramEditScreen";

const defaultArgs = {
	capacity: "capacity-1",
	descriptionText: "스토리북에서 확인할 description text 예시입니다.",
	errors: {},
	hasUnschedulableRoutine: false,
	instructorName: "샘플 instructor name 1",
	instructorOptions: [
		{
			id: "item-1",
			subtitle: "스토리북에서 확인할 subtitle 예시입니다.",
		},
		{
			id: "item-1",
			subtitle: "스토리북에서 확인할 subtitle 예시입니다.",
		},
	],
	instructorQuery: "샘플",
	isInstructorPickerOpen: false,
	isRoutinePickerOpen: false,
	isSubmitDisabled: false,
	isSubmitPending: false,
	level: "샘플 level 1",
	onChangeCapacityInput: (..._args: never[]) => undefined,
	onChangeInstructorQueryInput: (..._args: never[]) => undefined,
	onChangeLevelSelect: (..._args: never[]) => undefined,
	onChangeNameInput: (..._args: never[]) => undefined,
	onChangeRoutineQueryInput: (..._args: never[]) => undefined,
	onClickCancelButton: (..._args: never[]) => undefined,
	onClickCloseInstructorPickerButton: (..._args: never[]) => undefined,
	onClickCloseRoutinePickerButton: (..._args: never[]) => undefined,
	onClickOpenInstructorPickerButton: (..._args: never[]) => undefined,
	onClickOpenRoutinePickerButton: (..._args: never[]) => undefined,
	onClickSubmitButton: (..._args: never[]) => undefined,
	onSelectInstructorOption: (..._args: never[]) => undefined,
	onSelectRoutineOption: (..._args: never[]) => undefined,
	routineName: "샘플 routine name 1",
	routineOptions: [
		{
			id: "item-1",
			subtitle: "스토리북에서 확인할 subtitle 예시입니다.",
		},
		{
			id: "item-1",
			subtitle: "스토리북에서 확인할 subtitle 예시입니다.",
		},
	],
	routinePreview: [
		{
			exerciseName: "샘플 exercise name 1",
			id: "item-1",
			isSchedulable: false,
			notes: "스토리북에서 확인할 notes 예시입니다.",
			order: 1,
			repetitions: 1,
			restTime: 1,
		},
		{
			exerciseName: "샘플 exercise name 1",
			id: "item-1",
			isSchedulable: false,
			notes: "스토리북에서 확인할 notes 예시입니다.",
			order: 1,
			repetitions: 1,
			restTime: 1,
		},
	],
	routineQuery: "샘플",
};

const busyArgs = {
	...defaultArgs,
	isSubmitPending: true,
};

const emptyStateArgs = {
	...defaultArgs,
	instructorOptions: [],
	routineOptions: [],
	routinePreview: [],
};

const meta = {
	component: TimelineSessionProgramEditScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof TimelineSessionProgramEditScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Busy: Story = {
	args: busyArgs as never,
};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};

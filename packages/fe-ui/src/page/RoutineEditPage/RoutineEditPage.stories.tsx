import type { Meta, StoryObj } from "@storybook/react";
import { RoutineEditPage } from "./RoutineEditPage";

const defaultArgs = {
	activities: [
		{
			exerciseName: "샘플 exercise name 1",
			imageAssetUrl: "https://example.com/image-asset-url-1",
			imageFileId: "image-file-1",
			isSchedulable: false,
			notes: "스토리북에서 확인할 notes 예시입니다.",
			repetitions: "repetitions-1",
			restTime: "2026-04-14T09:00:00.000Z",
			taskId: "task-1",
			videoAssetUrl: "https://example.com/video-asset-url-1",
			videoFileId: "video-file-1",
		},
		{
			exerciseName: "샘플 exercise name 1",
			imageAssetUrl: "https://example.com/image-asset-url-1",
			imageFileId: "image-file-1",
			isSchedulable: false,
			notes: "스토리북에서 확인할 notes 예시입니다.",
			repetitions: "repetitions-1",
			restTime: "2026-04-14T09:00:00.000Z",
			taskId: "task-1",
			videoAssetUrl: "https://example.com/video-asset-url-1",
			videoFileId: "video-file-1",
		},
	],
	activitiesError: "activities-error-1",
	candidateTasks: [
		{
			exerciseCount: 12,
			exerciseName: "샘플 exercise name 1",
			id: "item-1",
			imageAssetUrl: "https://example.com/image-asset-url-1",
			imageFileId: "image-file-1",
			isSchedulable: false,
			videoAssetUrl: "https://example.com/video-asset-url-1",
			videoFileId: "video-file-1",
		},
		{
			exerciseCount: 12,
			exerciseName: "샘플 exercise name 1",
			id: "item-1",
			imageAssetUrl: "https://example.com/image-asset-url-1",
			imageFileId: "image-file-1",
			isSchedulable: false,
			videoAssetUrl: "https://example.com/video-asset-url-1",
			videoFileId: "video-file-1",
		},
	],
	exerciseQuery: "샘플",
	isEmptyActivitiesWarningOpen: false,
	isLoading: false,
	isNotFound: false,
	isSubmitting: false,
	isTasksLoading: false,
	label: "샘플 label 1",
	labelError: "샘플 label error 1",
	nameError: "샘플 name error 1",
	onChangeActivityInput: (..._args: never[]) => undefined,
	onChangeExerciseQueryInput: (..._args: never[]) => undefined,
	onChangeLabelInput: (..._args: never[]) => undefined,
	onChangeNameInput: (..._args: never[]) => undefined,
	onClickAddActivityButton: (..._args: never[]) => undefined,
	onClickCancelButton: (..._args: never[]) => undefined,
	onClickConfirmEmptyActivitiesWarningButton: (..._args: never[]) => undefined,
	onClickRemoveActivityButton: (..._args: never[]) => undefined,
	onClickSaveButton: (..._args: never[]) => undefined,
	onCloseEmptyActivitiesWarningModal: (..._args: never[]) => undefined,
	onReorderActivities: (..._args: never[]) => undefined,
	routineName: "샘플 routine name 1",
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const notFoundArgs = {
	...defaultArgs,
	isNotFound: true,
};

const busyArgs = {
	...defaultArgs,
	isSubmitting: true,
};

const meta = {
	component: RoutineEditPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof RoutineEditPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const NotFound: Story = {
	args: notFoundArgs as never,
};

export const Busy: Story = {
	args: busyArgs as never,
};

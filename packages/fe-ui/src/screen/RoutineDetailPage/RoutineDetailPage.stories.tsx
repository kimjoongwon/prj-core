import type { Meta, StoryObj } from "@storybook/react";
import { createStorybookMock } from "../storybookMock";
import { RoutineDetailPage } from "./RoutineDetailPage";

const defaultArgs = {
	errorDescription: "스토리북에서 확인할 error description 예시입니다.",
	errorTitle: "샘플 error title",
	isDeleteModalOpen: false,
	isDeleting: false,
	isLoading: false,
	onClickBackButton: (..._args: never[]) => undefined,
	onClickDeleteConfirm: (..._args: never[]) => undefined,
	onClickEditButton: (..._args: never[]) => undefined,
	onClickOpenDeleteModal: (..._args: never[]) => undefined,
	onClickRetryButton: (..._args: never[]) => undefined,
	onCloseDeleteModal: (..._args: never[]) => undefined,
	routine: {
		activities: [
			{
				exerciseName: createStorybookMock("exerciseName") as never,
				id: createStorybookMock("id") as never,
				imageAssetUrl: createStorybookMock("imageAssetUrl") as never,
				notes: createStorybookMock("notes") as never,
				order: createStorybookMock("order") as never,
				repetitions: createStorybookMock("repetitions") as never,
				restTime: createStorybookMock("restTime") as never,
				videoAssetUrl: createStorybookMock("videoAssetUrl") as never,
			},
			{
				exerciseName: createStorybookMock("exerciseName") as never,
				id: createStorybookMock("id") as never,
				imageAssetUrl: createStorybookMock("imageAssetUrl") as never,
				notes: createStorybookMock("notes") as never,
				order: createStorybookMock("order") as never,
				repetitions: createStorybookMock("repetitions") as never,
				restTime: createStorybookMock("restTime") as never,
				videoAssetUrl: createStorybookMock("videoAssetUrl") as never,
			},
		],
		createdAt: "2026-04-14T09:00:00.000Z",
		id: "item-1",
		label: "샘플 label 1",
		programs: [
			{
				id: createStorybookMock("id") as never,
			},
			{
				id: createStorybookMock("id") as never,
			},
		],
		updatedAt: "2026-04-14T09:00:00.000Z",
	},
	showRetryButton: false,
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const busyArgs = {
	...defaultArgs,
	isDeleting: true,
};

const meta = {
	component: RoutineDetailPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof RoutineDetailPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const Busy: Story = {
	args: busyArgs as never,
};

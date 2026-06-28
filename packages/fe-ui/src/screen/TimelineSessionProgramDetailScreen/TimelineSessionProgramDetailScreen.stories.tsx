import type { Meta, StoryObj } from "@storybook/react";
import { TimelineSessionProgramDetailScreen } from "./TimelineSessionProgramDetailScreen";

const defaultArgs = {
	isDeleteModalOpen: false,
	isDeletePending: false,
	isLoading: false,
	isNotFound: false,
	onClickDeleteButton: (..._args: never[]) => undefined,
	onClickDeleteCancelButton: (..._args: never[]) => undefined,
	onClickDeleteConfirmButton: (..._args: never[]) => undefined,
	onClickEditButton: (..._args: never[]) => undefined,
	program: {
		activityCountLabel: "샘플 activity count label 1",
		capacityLabel: "샘플 capacity label 1",
		createdAt: "2026-04-14T09:00:00.000Z",
		descriptionText: "스토리북에서 확인할 description text 예시입니다.",
		executionPlan: [
			{
				exerciseCount: 12,
				exerciseDescription: "워밍업 후 스쿼트 12회를 진행합니다.",
				exerciseDuration: 90,
				exerciseName: "샘플 exercise name 1",
				id: "activity-1",
				imageAssetHref: "/assets/image-1",
				imageFileId: "image-file-1",
				notes: "호흡을 유지하면서 천천히 진행합니다.",
				order: 1,
				repetitions: 12,
				restTime: 30,
				taskId: "task-1",
				videoAssetHref: "/assets/video-1",
				videoFileId: "video-file-1",
			},
			{
				exerciseCount: 10,
				exerciseDescription: "런지 좌우 10회씩 진행합니다.",
				exerciseDuration: 120,
				exerciseName: "샘플 exercise name 2",
				id: "activity-2",
				imageAssetHref: null,
				imageFileId: null,
				notes: "균형이 무너지지 않도록 주의합니다.",
				order: 2,
				repetitions: 10,
				restTime: 45,
				taskId: "task-2",
				videoAssetHref: null,
				videoFileId: null,
			},
		],
		instructorLabel: "샘플 instructor label 1",
		levelLabel: "샘플 level label 1",
		routineHref: "/admin/timelines/timeline-1/routines/routine-1",
		routineName: "샘플 routine name 1",
		sessionHref: "/admin/timelines/timeline-1/sessions/session-1",
		sessionName: "샘플 session name 1",
	},
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const notFoundArgs = {
	...defaultArgs,
	isNotFound: true,
};

const meta = {
	title: "screen/TimelineSessionProgramDetailScreen",
	component: TimelineSessionProgramDetailScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof TimelineSessionProgramDetailScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const NotFound: Story = {
	args: notFoundArgs as never,
};

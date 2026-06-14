import type { Meta, StoryObj } from "@storybook/react";
import { TimelineSessionDetailScreen } from "./TimelineSessionDetailScreen";

const defaultArgs = {
	deleteProgramTargetName: "오전 루틴 A",
	descriptionText: "스토리북에서 확인할 description text 예시입니다.",
	isDeleteProgramModalOpen: false,
	isDeleteProgramPending: false,
	isDeleteSessionModalOpen: false,
	isDeleteSessionPending: false,
	onClickCreateProgramButton: (..._args: never[]) => undefined,
	onClickDeleteProgramButton: (..._args: never[]) => undefined,
	onClickDeleteProgramCancelButton: (..._args: never[]) => undefined,
	onClickDeleteProgramConfirmButton: (..._args: never[]) => undefined,
	onClickDeleteSessionButton: (..._args: never[]) => undefined,
	onClickDeleteSessionCancelButton: (..._args: never[]) => undefined,
	onClickDeleteSessionConfirmButton: (..._args: never[]) => undefined,
	onClickEditButton: (..._args: never[]) => undefined,
	onClickEditProgramButton: (..._args: never[]) => undefined,
	programs: [
		{
			activityCountLabel: "활동 8개",
			capacityLabel: "정원 12명",
			href: "/timelines/timeline-1/sessions/session-1/programs/program-1",
			id: "program-1",
			instructorName: "김코치",
			isConnectionResolved: true,
			levelLabel: "초급",
			name: "오전 루틴 A",
			previewText: "전신 스트레칭과 하체 루틴",
			routineName: "Morning Routine",
		},
		{
			activityCountLabel: "활동 5개",
			capacityLabel: "정원 8명",
			href: "/timelines/timeline-1/sessions/session-1/programs/program-2",
			id: "program-2",
			instructorName: "이코치",
			isConnectionResolved: false,
			levelLabel: "중급",
			name: "오후 루틴 B",
			previewText: "상체 집중 루틴",
			routineName: "Afternoon Routine",
		},
	],
	resolvedPrograms: 1,
	session: {
		createdAt: "2026-04-14T09:00:00.000Z",
		description: "스토리북에서 확인할 description 예시입니다.",
		endDateTime: "2026-04-14T10:30:00.000Z",
		recurringDayLabel: "월/수/금",
		repeatCycleLabel: "주간",
		startDateTime: "2026-04-14T09:00:00.000Z",
		timelineHref: "/timelines/timeline-1",
		timelineName: "봄 시즌 타임라인",
		type: "GROUP",
		typeColor: "primary",
		typeLabel: "그룹 수업",
	},
	title: "오전 세션",
	totalPrograms: 2,
	unresolvedPrograms: 1,
};

const emptyStateArgs = {
	...defaultArgs,
	programs: [],
};

const meta = {
	component: TimelineSessionDetailScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof TimelineSessionDetailScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};

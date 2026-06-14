import type { Meta, StoryObj } from "@storybook/react";
import { AbilityListScreen } from "./AbilityListScreen";

const abilityFixtures = [
	{
		actionId: "action-read",
		action: {
			createdAt: "2026-04-14T09:00:00.000Z",
			displayName: "조회",
			id: "action-read",
			isSystem: true,
			name: "read",
			order: 1,
			updatedAt: "2026-04-14T09:00:00.000Z",
		},
		conditions: null,
		createdAt: "2026-04-14T09:00:00.000Z",
		description: "이용자 기본 정보를 확인합니다.",
		fields: [],
		id: "ability-read-user",
		inverted: false,
		name: "Can 조회 사용자",
		subjectId: "subject-user",
		subject: {
			displayName: "사용자",
			fieldCount: 12,
			name: "User",
		},
		updatedAt: "2026-04-14T09:00:00.000Z",
	},
	{
		actionId: "action-update",
		action: {
			createdAt: "2026-04-14T09:00:00.000Z",
			displayName: "수정",
			id: "action-update",
			isSystem: true,
			name: "update",
			order: 2,
			updatedAt: "2026-04-14T09:00:00.000Z",
		},
		conditions: { spaceId: "current" },
		createdAt: "2026-04-14T09:00:00.000Z",
		description: "현재 공간의 예약만 수정합니다.",
		fields: ["name", "startedAt"],
		id: "ability-update-reservation",
		inverted: false,
		name: "Can 수정 예약",
		subjectId: "subject-reservation",
		subject: {
			displayName: "예약",
			fieldCount: 8,
			name: "Reservation",
		},
		updatedAt: "2026-04-14T09:00:00.000Z",
	},
	{
		actionId: "action-delete",
		action: {
			createdAt: "2026-04-14T09:00:00.000Z",
			displayName: "삭제",
			id: "action-delete",
			isSystem: true,
			name: "delete",
			order: 3,
			updatedAt: "2026-04-14T09:00:00.000Z",
		},
		conditions: null,
		createdAt: "2026-04-14T09:00:00.000Z",
		description: "일괄 삭제는 제한합니다.",
		fields: [],
		id: "ability-deny-bulk-delete",
		inverted: true,
		name: "Cannot 접근 일괄 삭제",
		reason: "운영 안정성을 위해 제한",
		subjectId: "subject-bulk-delete",
		subject: {
			displayName: "일괄 삭제",
			fieldCount: 0,
			name: "BulkDelete",
		},
		updatedAt: "2026-04-14T09:00:00.000Z",
	},
];

const defaultSummary = {
	total: 3,
	filtered: 3,
	allow: 2,
	deny: 1,
	conditional: 1,
	fieldScoped: 1,
};

const defaultArgs = {
	abilities: abilityFixtures,
	actions: [
		{
			id: "action-read",
			label: "조회",
		},
		{
			id: "action-update",
			label: "수정",
		},
		{
			id: "action-delete",
			label: "삭제",
		},
	],
	filters: {
		searchTerm: "",
		selectedActionId: "",
		selectedInverted: "",
		selectedSubjectId: "",
	},
	isLoading: false,
	onChangeActionId: (..._args: never[]) => undefined,
	onChangeInverted: (..._args: never[]) => undefined,
	onChangeSearchTerm: (..._args: never[]) => undefined,
	onChangeSubjectId: (..._args: never[]) => undefined,
	onClickAbilityRow: (..._args: never[]) => undefined,
	onClickCreateButton: (..._args: never[]) => undefined,
	onClickResetFiltersButton: (..._args: never[]) => undefined,
	queryStates: {
		page: 1,
		take: 10,
		skip: 0,
		search: "",
		subjectId: "",
		actionId: "",
		inverted: "",
	},
	setQueryStates: (..._args: never[]) => undefined,
	summary: defaultSummary,
	subjects: [
		{
			id: "subject-user",
			label: "사용자",
		},
		{
			id: "subject-reservation",
			label: "예약",
		},
		{
			id: "subject-bulk-delete",
			label: "일괄 삭제",
		},
	],
	totalCount: 3,
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const filteredArgs = {
	...defaultArgs,
	abilities: [abilityFixtures[1]],
	filters: {
		searchTerm: "예약",
		selectedActionId: "action-update",
		selectedInverted: "false",
		selectedSubjectId: "subject-reservation",
	},
	queryStates: {
		page: 1,
		take: 10,
		skip: 0,
		search: "예약",
		subjectId: "subject-reservation",
		actionId: "action-update",
		inverted: "false",
	},
	summary: {
		...defaultSummary,
		filtered: 1,
	},
	totalCount: 1,
};

const emptyStateArgs = {
	...defaultArgs,
	abilities: [],
	actions: [],
	summary: {
		total: 0,
		filtered: 0,
		allow: 0,
		deny: 0,
		conditional: 0,
		fieldScoped: 0,
	},
	subjects: [],
	totalCount: 0,
};

const meta = {
	component: AbilityListScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof AbilityListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const Filtered: Story = {
	args: filteredArgs as never,
};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};

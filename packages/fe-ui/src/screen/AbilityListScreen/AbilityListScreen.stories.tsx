import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { AbilityListScreen } from "./AbilityListScreen";

const abilityFixtures: NonNullable<
	ComponentProps<typeof AbilityListScreen>["abilities"]
> = [
	{
		action: {
			description: null,
			group: null,
			config: null,
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			displayName: "조회",
			id: "ACT00000000000000000000001",
			name: "read",
			order: 1,
			updatedAt: new Date("2026-04-14T09:00:00.000Z"),
		},
		reason: null,
		conditions: null,
		createdAt: new Date("2026-04-14T09:00:00.000Z"),
		description: "이용자 기본 정보를 확인합니다.",
		fields: [],
		id: "ABT00000000000000000000021",
		inverted: false,
		name: "Can 조회 사용자",
		subject: {
			displayName: "사용자",
			fieldCount: 12,
			name: "User",
		},
		updatedAt: new Date("2026-04-14T09:00:00.000Z"),
	},
	{
		action: {
			description: null,
			group: null,
			config: null,
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			displayName: "수정",
			id: "ACT00000000000000000000002",
			name: "update",
			order: 2,
			updatedAt: new Date("2026-04-14T09:00:00.000Z"),
		},
		reason: null,
		conditions: { spaceId: "current" },
		createdAt: new Date("2026-04-14T09:00:00.000Z"),
		description: "현재 공간의 예약만 수정합니다.",
		fields: ["name", "startedAt"],
		id: "ABT00000000000000000000022",
		inverted: false,
		name: "Can 수정 예약",
		subject: {
			displayName: "예약",
			fieldCount: 8,
			name: "Reservation",
		},
		updatedAt: new Date("2026-04-14T09:00:00.000Z"),
	},
	{
		action: {
			description: null,
			group: null,
			config: null,
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			displayName: "삭제",
			id: "ACT00000000000000000000003",
			name: "delete",
			order: 3,
			updatedAt: new Date("2026-04-14T09:00:00.000Z"),
		},
		conditions: null,
		createdAt: new Date("2026-04-14T09:00:00.000Z"),
		description: "일괄 삭제는 제한합니다.",
		fields: [],
		id: "ABT00000000000000000000023",
		inverted: true,
		name: "Cannot 접근 일괄 삭제",
		reason: "운영 안정성을 위해 제한",
		subject: {
			displayName: "일괄 삭제",
			fieldCount: 0,
			name: "BulkDelete",
		},
		updatedAt: new Date("2026-04-14T09:00:00.000Z"),
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

const defaultArgs: ComponentProps<typeof AbilityListScreen> = {
	abilities: abilityFixtures,
	actions: [
		{
			id: "ACT00000000000000000000097",
			label: "조회",
		},
		{
			id: "ACT00000000000000000000101",
			label: "수정",
		},
		{
			id: "ACT00000000000000000000105",
			label: "삭제",
		},
	],
	filters: {
		searchTerm: "",
		selectedActionId: "",
		selectedInverted: "",
		selectedSubjectId: "",
	},
	onChangeActionId: () => undefined,
	onChangeInverted: () => undefined,
	onChangeSearchTerm: () => undefined,
	onChangeSubjectId: () => undefined,
	onClickAbilityRow: () => undefined,
	onClickCreateButton: () => undefined,
	onClickResetFiltersButton: () => undefined,
	queryStates: {
		page: 1,
		take: 10,
		skip: 0,
		search: "",
		subjectId: "",
		actionId: "",
		inverted: "",
	},
	setQueryStates: async () => new URLSearchParams(),
	summary: defaultSummary,
	subjects: [
		{
			id: "SBJ00000000000000000000136",
			label: "사용자",
		},
		{
			id: "SBJ00000000000000000000140",
			label: "예약",
		},
		{
			id: "SBJ00000000000000000000144",
			label: "일괄 삭제",
		},
	],
	totalCount: 3,
};

const filteredArgs = {
	...defaultArgs,
	abilities: [abilityFixtures[1]],
	filters: {
		searchTerm: "예약",
		selectedActionId: "ACT00000000000000000000101",
		selectedInverted: "false",
		selectedSubjectId: "SBJ00000000000000000000140",
	},
	queryStates: {
		page: 1,
		take: 10,
		skip: 0,
		search: "예약",
		subjectId: "SBJ00000000000000000000140",
		actionId: "ACT00000000000000000000101",
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
	title: "screen/AbilityListScreen",
	component: AbilityListScreen,
	// Date 응답 fixture는 JSON 기반 Controls 편집에서 제외합니다.
	argTypes: {
		abilities: { control: false },
		subjects: { control: false },
		actions: { control: false },
	},
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
} satisfies Meta<typeof AbilityListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filtered: Story = {
	args: filteredArgs,
};

export const EmptyState: Story = {
	args: emptyStateArgs,
};

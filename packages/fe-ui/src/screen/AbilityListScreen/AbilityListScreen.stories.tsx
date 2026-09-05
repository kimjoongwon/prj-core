import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AbilityListScreen } from "./AbilityListScreen";

const abilityFixtures: NonNullable<ComponentProps<typeof AbilityListScreen>["abilities"]> = [
	{
		actionId: 1n,
		action: {
			description: null,
			group: null,
			config: null,
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			displayName: "조회",
			id: 1n,
			name: "read",
			order: 1,
			updatedAt: new Date("2026-04-14T09:00:00.000Z"),
		},
		reason: null,
		conditions: null,
		createdAt: new Date("2026-04-14T09:00:00.000Z"),
		description: "이용자 기본 정보를 확인합니다.",
		fields: [],
		id: 21n,
		inverted: false,
		name: "Can 조회 사용자",
		subjectId: 11n,
		subject: {
			displayName: "사용자",
			fieldCount: 12,
			name: "User",
		},
		updatedAt: new Date("2026-04-14T09:00:00.000Z"),
	},
	{
		actionId: 2n,
		action: {
			description: null,
			group: null,
			config: null,
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			displayName: "수정",
			id: 2n,
			name: "update",
			order: 2,
			updatedAt: new Date("2026-04-14T09:00:00.000Z"),
		},
		reason: null,
		conditions: { spaceId: "current" },
		createdAt: new Date("2026-04-14T09:00:00.000Z"),
		description: "현재 공간의 예약만 수정합니다.",
		fields: ["name", "startedAt"],
		id: 22n,
		inverted: false,
		name: "Can 수정 예약",
		subjectId: 12n,
		subject: {
			displayName: "예약",
			fieldCount: 8,
			name: "Reservation",
		},
		updatedAt: new Date("2026-04-14T09:00:00.000Z"),
	},
	{
		actionId: 3n,
		action: {
			description: null,
			group: null,
			config: null,
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			displayName: "삭제",
			id: 3n,
			name: "delete",
			order: 3,
			updatedAt: new Date("2026-04-14T09:00:00.000Z"),
		},
		conditions: null,
		createdAt: new Date("2026-04-14T09:00:00.000Z"),
		description: "일괄 삭제는 제한합니다.",
		fields: [],
		id: 23n,
		inverted: true,
		name: "Cannot 접근 일괄 삭제",
		reason: "운영 안정성을 위해 제한",
		subjectId: 13n,
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
			id: 97n,
			label: "조회",
		},
		{
			id: 101n,
			label: "수정",
		},
		{
			id: 105n,
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
			id: 136n,
			label: "사용자",
		},
		{
			id: 140n,
			label: "예약",
		},
		{
			id: 144n,
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
		selectedActionId: "2",
		selectedInverted: "false",
		selectedSubjectId: "12",
	},
	queryStates: {
		page: 1,
		take: 10,
		skip: 0,
		search: "예약",
		subjectId: "12",
		actionId: "2",
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
	// bigint 응답 fixture는 JSON 기반 Controls 편집에서 제외합니다.
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

export const Loading: Story = {
	args: loadingArgs,
};

export const Filtered: Story = {
	args: filteredArgs,
};

export const EmptyState: Story = {
	args: emptyStateArgs,
};

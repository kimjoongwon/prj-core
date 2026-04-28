import type { Meta, StoryObj } from "@storybook/react";
import { AbilityListPage } from "./AbilityListPage";

const defaultArgs = {
	abilities: [
		{
			actionId: "action-1",
			action: {
				createdAt: "2026-04-14T09:00:00.000Z",
				displayName: "조회",
				id: "action-1",
				isSystem: true,
				name: "read",
				order: 1,
				updatedAt: "2026-04-14T09:00:00.000Z",
			},
			conditions: null,
			createdAt: "2026-04-14T09:00:00.000Z",
			description: "샘플 권한 설명입니다.",
			fields: [],
			id: "item-1",
			inverted: false,
			name: "ability.read.user",
			subjectId: "subject-1",
			subject: {
				displayName: "사용자",
				fieldCount: 12,
				name: "User",
			},
			updatedAt: "2026-04-14T09:00:00.000Z",
		},
		{
			actionId: "action-2",
			action: {
				createdAt: "2026-04-14T09:00:00.000Z",
				displayName: "수정",
				id: "action-2",
				isSystem: true,
				name: "update",
				order: 2,
				updatedAt: "2026-04-14T09:00:00.000Z",
			},
			conditions: { spaceId: "current" },
			createdAt: "2026-04-14T09:00:00.000Z",
			description: "조건이 있는 샘플 권한입니다.",
			fields: ["name", "email"],
			id: "item-2",
			inverted: true,
			name: "ability.update.user.restricted",
			reason: "운영자 전용",
			subjectId: "subject-1",
			subject: {
				displayName: "사용자",
				fieldCount: 12,
				name: "User",
			},
			updatedAt: "2026-04-14T09:00:00.000Z",
		},
	],
	actions: [
		{
			id: "item-1",
			label: "샘플 label 1",
		},
		{
			id: "item-1",
			label: "샘플 label 1",
		},
	],
	filters: {
		searchTerm: "샘플",
		selectedActionId: "selected-action-1",
		selectedInverted: "selected-inverted-1",
		selectedSubjectId: "selected-subject-1",
	},
	isLoading: false,
	onChangeActionId: (..._args: never[]) => undefined,
	onChangeInverted: (..._args: never[]) => undefined,
	onChangeSearchTerm: (..._args: never[]) => undefined,
	onChangeSubjectId: (..._args: never[]) => undefined,
	onClickAbilityRow: (..._args: never[]) => undefined,
	onClickCreateButton: (..._args: never[]) => undefined,
	onClickResetFiltersButton: (..._args: never[]) => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "" },
	setQueryStates: (..._args: never[]) => undefined,
	subjects: [
		{
			id: "item-1",
			label: "샘플 label 1",
		},
		{
			id: "item-1",
			label: "샘플 label 1",
		},
	],
	totalCount: 12,
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const emptyStateArgs = {
	...defaultArgs,
	abilities: [],
	actions: [],
	subjects: [],
	totalCount: 0,
};

const meta = {
	component: AbilityListPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof AbilityListPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};

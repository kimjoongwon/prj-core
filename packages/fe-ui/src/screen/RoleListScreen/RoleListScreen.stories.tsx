import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RoleListScreen } from "./RoleListScreen";

const defaultArgs: ComponentProps<typeof RoleListScreen> = {
	isLoading: false,
	onClickCreateButton: () => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "" },
	roles: [
		{
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			updatedAt: null,
			name: "operator",
			classification: null,
			associations: null,
			description: "스토리북에서 확인할 description 예시입니다.",
			displayName: "샘플 display name 1",
			id: 1n,
			removedAt: new Date("2026-04-14T09:00:00.000Z"),
		},
		{
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			updatedAt: null,
			name: "operator",
			classification: null,
			associations: null,
			description: "스토리북에서 확인할 description 예시입니다.",
			displayName: "샘플 display name 1",
			id: 1n,
			removedAt: new Date("2026-04-14T09:00:00.000Z"),
		},
	],
	setQueryStates: async () => new URLSearchParams(),
	totalCount: 12,
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const emptyStateArgs = {
	...defaultArgs,
	roles: [],
	totalCount: 0,
};

const meta = {
	title: "screen/RoleListScreen",
	component: RoleListScreen,
	// bigint 응답 fixture는 JSON 기반 Controls 편집에서 제외합니다.
	argTypes: {
		roles: { control: false },
	},
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
} satisfies Meta<typeof RoleListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs,
};

export const EmptyState: Story = {
	args: emptyStateArgs,
};

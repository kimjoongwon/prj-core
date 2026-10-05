import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TemplateListScreen } from "./TemplateListScreen";

const defaultArgs: ComponentProps<typeof TemplateListScreen> = {
	isLoading: false,
	isToggling: false,
	onClickCreateButton: () => undefined,
	onClickTemplateCode: () => undefined,
	onToggleTemplateStatusSwitch: async () => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "", isActive: "" },
	setQueryStates: async () => new URLSearchParams(),
	templates: [
		{
			updatedAt: null,
			removedAt: null,
			name: "안내 메일",
			type: "EMAIL",
			content: "서비스 이용을 안내합니다.",
			code: "code-1",
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			id: 1n,
			isActive: false,
		},
		{
			updatedAt: null,
			removedAt: null,
			name: "안내 메일",
			type: "EMAIL",
			content: "서비스 이용을 안내합니다.",
			code: "code-1",
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			id: 1n,
			isActive: false,
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
	templates: [],
	totalCount: 0,
};

const meta = {
	title: "screen/TemplateListScreen",
	component: TemplateListScreen,
	// bigint 응답 fixture는 JSON 기반 Controls 편집에서 제외합니다.
	argTypes: {
		templates: { control: false },
	},
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
} satisfies Meta<typeof TemplateListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs,
};

export const EmptyState: Story = {
	args: emptyStateArgs,
};

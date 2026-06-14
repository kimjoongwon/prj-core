import type { Meta, StoryObj } from "@storybook/react";
import { SpaceListScreen } from "./SpaceListScreen";

const defaultArgs = {
	isLoading: false,
	onClickCreateButton: (..._args: never[]) => undefined,
	onClickSpaceGroundName: (..._args: never[]) => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "" },
	setQueryStates: (..._args: never[]) => undefined,
	spaces: [
		{
			address: "address-1",
			businessNo: "123-45-67891",
			createdAt: "2026-04-14T09:00:00.000Z",
			email: "member1@example.com",
			id: "item-1",
			label: "샘플 label 1",
			phone: "010-1234-5670",
		},
		{
			address: "address-1",
			businessNo: "123-45-67891",
			createdAt: "2026-04-14T09:00:00.000Z",
			email: "member1@example.com",
			id: "item-1",
			label: "샘플 label 1",
			phone: "010-1234-5670",
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
	spaces: [],
	totalCount: 0,
};

const meta = {
	component: SpaceListScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof SpaceListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};

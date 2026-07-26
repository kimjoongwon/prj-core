import type { Meta, StoryObj } from "@storybook/react";
import { SpaceListScreen } from "./SpaceListScreen";

const defaultArgs = {
	isLoading: false,
	onClickCreateButton: (..._args: never[]) => undefined,
	onClickSpaceFitnessCenterName: (..._args: never[]) => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "" },
	setQueryStates: (..._args: never[]) => undefined,
	spaces: [
		{
			createdAt: "2026-04-14T09:00:00.000Z",
			fitnessCenter: {
				address: "address-1",
				businessNo: "123-45-67891",
				company: {
					address: "company-address-1",
					businessNo: "123-45-67891",
					name: "샘플 운영사 1",
				},
				email: "center1@example.com",
				name: "샘플 피트니스 센터 1",
				phone: "010-1234-5670",
			},
			id: "item-1",
		},
		{
			createdAt: "2026-04-14T09:00:00.000Z",
			fitnessCenter: {
				address: "address-2",
				businessNo: "555-55-55555",
				company: {
					address: "company-address-2",
					businessNo: "555-55-55555",
					name: "샘플 운영사 2",
				},
				email: "center2@example.com",
				name: "샘플 피트니스 센터 2",
				phone: "010-5555-5555",
			},
			id: "item-2",
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
	title: "screen/SpaceListScreen",
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

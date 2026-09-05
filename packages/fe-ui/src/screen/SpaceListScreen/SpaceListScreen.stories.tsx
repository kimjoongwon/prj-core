import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SpaceListScreen } from "./SpaceListScreen";

const defaultArgs: ComponentProps<typeof SpaceListScreen> = {
	isLoading: false,
	onClickCreateButton: () => undefined,
	onClickSpaceFitnessCenterName: () => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "", contentLanguageCode: "" },
	setQueryStates: async () => new URLSearchParams(),
	spaces: [
		{
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			updatedAt: null,
			removedAt: null,
			contentLanguageCode: "ko_KR",
			fitnessCenter: {
				id: 1n,
				spaceId: 1n,
				companyId: 1n,
				createdAt: new Date("2026-04-14T09:00:00.000Z"),
				updatedAt: null,
				removedAt: null,
				address: "address-1",
				company: {
					id: 1n,
					createdAt: new Date("2026-04-14T09:00:00.000Z"),
					updatedAt: null,
					removedAt: null,
					businessNo: "123-45-67890",
					phone: "02-1234-5678",
					email: "company@example.com",
					address: "company-address-1",
						name: "샘플 운영사 1",
				},
				email: "center1@example.com",
				name: "샘플 피트니스 센터 1",
				phone: "010-1234-5670",
			},
			id: 1n,
		},
		{
			createdAt: new Date("2026-04-14T09:00:00.000Z"),
			updatedAt: null,
			removedAt: null,
			contentLanguageCode: "ko_KR",
			fitnessCenter: {
				id: 1n,
				spaceId: 1n,
				companyId: 1n,
				createdAt: new Date("2026-04-14T09:00:00.000Z"),
				updatedAt: null,
				removedAt: null,
				address: "address-2",
				company: {
					id: 1n,
					createdAt: new Date("2026-04-14T09:00:00.000Z"),
					updatedAt: null,
					removedAt: null,
					businessNo: "123-45-67890",
					phone: "02-1234-5678",
					email: "company@example.com",
					address: "company-address-2",
						name: "샘플 운영사 2",
				},
				email: "center2@example.com",
				name: "샘플 피트니스 센터 2",
				phone: "010-5555-5555",
			},
			id: 2n,
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
	// bigint 응답 fixture는 JSON 기반 Controls 편집에서 제외합니다.
	argTypes: {
		spaces: { control: false },
	},
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
} satisfies Meta<typeof SpaceListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs,
};

export const EmptyState: Story = {
	args: emptyStateArgs,
};

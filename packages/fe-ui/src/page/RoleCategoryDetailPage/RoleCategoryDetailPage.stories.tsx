import type { Meta, StoryObj } from "@storybook/react";
import { RoleCategoryDetailPage } from "./RoleCategoryDetailPage";

const defaultArgs = {
	category: {
		id: "category-operations",
		name: "운영 관리",
		type: "SYSTEM",
		parentId: "category-admin",
		parent: {
			id: "category-admin",
			name: "관리자",
		},
		children: [
			{
				id: "category-operations-child-1",
				name: "문의 운영",
				_count: {
					roleClassifications: 2,
				},
			},
			{
				id: "category-operations-child-2",
				name: "콘텐츠 운영",
				_count: {
					roleClassifications: 1,
				},
			},
		],
		roleClassifications: [
			{
				id: "classification-1",
				roleId: "role-admin",
				role: {
					id: "role-admin",
					name: "admin",
					displayName: "운영 관리자",
					isSystem: true,
				},
			},
			{
				id: "classification-2",
				roleId: "role-agent",
				role: {
					id: "role-agent",
					name: "agent",
					displayName: "문의 담당자",
					isSystem: false,
				},
			},
		],
		createdAt: "2026-04-14T09:00:00.000Z",
		updatedAt: "2026-04-18T11:30:00.000Z",
	},
	isDeleteModalOpen: false,
	isDeleting: false,
	isLoading: false,
	onClickBackButton: (..._args: never[]) => undefined,
	onClickDeleteButton: (..._args: never[]) => undefined,
	onClickDeleteConfirm: (..._args: never[]) => undefined,
	onClickEditButton: (..._args: never[]) => undefined,
	onCloseDeleteModal: (..._args: never[]) => undefined,
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const busyArgs = {
	...defaultArgs,
	isDeleting: true,
	isDeleteModalOpen: true,
};

const meta = {
	component: RoleCategoryDetailPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof RoleCategoryDetailPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const Busy: Story = {
	args: busyArgs as never,
};

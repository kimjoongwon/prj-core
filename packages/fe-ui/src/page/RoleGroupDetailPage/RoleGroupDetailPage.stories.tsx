import type { Meta, StoryObj } from "@storybook/react";
import { RoleGroupDetailPage } from "./RoleGroupDetailPage";

const defaultArgs = {
	group: {
		id: "group-core-admin",
		name: "core-admin",
		label: "코어 관리자",
		type: "SYSTEM",
		createdAt: "2026-04-14T09:00:00.000Z",
		updatedAt: "2026-04-18T11:30:00.000Z",
		roleAssociations: [
			{
				id: "association-1",
				roleId: "role-admin",
				role: {
					id: "role-admin",
					name: "admin",
					displayName: "운영 관리자",
					isSystem: true,
				},
			},
			{
				id: "association-2",
				roleId: "role-auditor",
				role: {
					id: "role-auditor",
					name: "auditor",
					displayName: "감사 전용",
					isSystem: false,
				},
			},
		],
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
	component: RoleGroupDetailPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof RoleGroupDetailPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const Busy: Story = {
	args: busyArgs as never,
};

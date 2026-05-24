import type { Meta, StoryObj } from "@storybook/react";
import { createStorybookMock } from "../storybookMock";
import { ActionDetailPage } from "./ActionDetailPage";

const defaultArgs = {
	action: {
		config: createStorybookMock("config") as never,
		createdAt: "2026-04-14T09:00:00.000Z",
		description: "스토리북에서 확인할 description 예시입니다.",
		displayName: "샘플 display name 1",
		group: "샘플 group 1",
		id: "item-1",
		isSystem: false,
		order: 1,
		updatedAt: "2026-04-14T09:00:00.000Z",
	},
	isDeleting: false,
	isLoading: false,
	onClickBackButton: (..._args: never[]) => undefined,
	onClickDeleteConfirmButton: (..._args: never[]) => undefined,
	onClickEditButton: (..._args: never[]) => undefined,
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const busyArgs = {
	...defaultArgs,
	isDeleting: true,
};

const meta = {
	component: ActionDetailPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof ActionDetailPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const Busy: Story = {
	args: busyArgs as never,
};

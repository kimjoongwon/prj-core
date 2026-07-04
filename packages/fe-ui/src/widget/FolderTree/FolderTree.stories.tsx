import type { Meta, StoryObj } from "@storybook/react";
import { FolderTree } from "./FolderTree";

const folders = [
	{ id: "root", name: "공용 자료" },
	{ id: "image", name: "이미지", parentFolderId: "root" },
	{ id: "video", name: "비디오", parentFolderId: "root" },
	{ id: "docs", name: "문서" },
];

const meta = {
	title: "widget/FolderTree",
	component: FolderTree,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		folders,
		selectedFolderId: "image",
		expandedFolderIds: new Set(["root"]),
		showCreateButton: true,
		showRenameButton: true,
		showDeleteButton: true,
		onSelect: () => undefined,
		onCreate: () => undefined,
		onRename: () => undefined,
		onDelete: () => undefined,
	},
} satisfies Meta<typeof FolderTree>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	render: (args) => (
		<div className="w-[320px]">
			<FolderTree {...args} />
		</div>
	),
};
export const Loading: Story = {
	args: { isLoading: true, folders: [] },
	render: Default.render,
};

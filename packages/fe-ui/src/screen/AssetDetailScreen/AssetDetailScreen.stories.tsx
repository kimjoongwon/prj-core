import type { Meta, StoryObj } from "@storybook/react";
import { AssetDetailScreen } from "./AssetDetailScreen";

const defaultArgs = {
	asset: {
		checksum: "checksum-1",
		createdAt: "2026-04-14T09:00:00.000Z",
		folderId: "folder-1",
		id: "item-1",
		kind: "IMAGE",
		mimeType: "샘플 mime type 1",
		originalName: "샘플 original name 1",
		publicUrl: "https://example.com/public-url-1",
		sizeBytes: 1024,
		status: "UPLOADING",
		storageKey: "storage-key-1",
	},
	folders: [
		{
			id: "folder-1",
			name: "기본 폴더",
		},
		{
			id: "folder-2",
			name: "보관함",
		},
	],
	isLoading: false,
	isMoving: false,
	isRemoving: false,
	onChangeTargetFolderSelection: (..._args: never[]) => undefined,
	onClickBackButton: (..._args: never[]) => undefined,
	onClickDeleteAssetButton: async (..._args: never[]) => undefined,
	onClickMoveAssetButton: async (..._args: never[]) => undefined,
	targetFolderError: "target-folder-error-1",
	targetFolderId: "folder-2",
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const emptyStateArgs = {
	...defaultArgs,
	folders: [],
};

const meta = {
	component: AssetDetailScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof AssetDetailScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};

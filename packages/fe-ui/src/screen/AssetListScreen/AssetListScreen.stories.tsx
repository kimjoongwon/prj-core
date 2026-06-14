import type { Meta, StoryObj } from "@storybook/react";
import { AssetListScreen } from "./AssetListScreen";

const defaultArgs = {
	assets: [
		{
			createdAt: "2026-04-14T09:00:00.000Z",
			id: "item-1",
			kind: "IMAGE",
			mimeType: "샘플 mime type 1",
			originalName: "샘플 original name 1",
			publicUrl: "https://example.com/public-url-1",
			sizeBytes: 1024,
			status: "UPLOADING",
		},
		{
			createdAt: "2026-04-14T09:00:00.000Z",
			id: "item-1",
			kind: "IMAGE",
			mimeType: "샘플 mime type 1",
			originalName: "샘플 original name 1",
			publicUrl: "https://example.com/public-url-1",
			sizeBytes: 1024,
			status: "UPLOADING",
		},
	],
	folders: [
		{
			id: "item-1",
			parentFolderId: "parent-folder-1",
		},
		{
			id: "item-1",
			parentFolderId: "parent-folder-1",
		},
	],
	hasSelectedSpace: false,
	isCreatingFolder: false,
	isLoading: false,
	isOpen: false,
	isRemoving: false,
	isRemovingFolder: false,
	isStoreReady: false,
	isUpdatingFolder: false,
	isUploadingAsset: false,
	onClose: (..._args: never[]) => undefined,
	onCreateFolder: async (..._args: never[]) => undefined,
	onDeleteAsset: async (..._args: never[]) => undefined,
	onDeleteFolder: async (..._args: never[]) => undefined,
	onRenameFolder: async (..._args: never[]) => undefined,
	onSelectAsset: (..._args: never[]) => undefined,
	onUploadAsset: async (..._args: never[]) => undefined,
	queryStates: { page: 1, take: 10, skip: 0, search: "" },
	selectedAssetId: "asset-1",
	setQueryStates: (..._args: never[]) => undefined,
	totalCount: 12,
};

const loadingArgs = {
	...defaultArgs,
	isLoading: true,
};

const emptyStateArgs = {
	...defaultArgs,
	assets: [],
	folders: [],
	totalCount: 0,
};

const meta = {
	component: AssetListScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof AssetListScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: loadingArgs as never,
};

export const EmptyState: Story = {
	args: emptyStateArgs as never,
};
